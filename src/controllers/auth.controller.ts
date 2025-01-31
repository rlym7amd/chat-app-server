import { Request, Response } from "express";
import { createUser, getUserByEmail } from "../services/user.service";
import { signJWT, validatePassword, verifyJwt } from "../utils";
import { log } from "../logger";

const { ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } = process.env;

export async function registerUser(req: Request, res: Response) {
  try {
    const user = await createUser(req.body);

    const accessToken = await signJWT({ id: user?.id }, ACCESS_TOKEN_TTL!);
    const refreshToken = await signJWT({ id: user?.id }, REFRESH_TOKEN_TTL!);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 mins
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (err: any) {
    log.error(`Database error: ${err.message}`);
    // PostgreSQL unique violation error code
    if (err.code === "23505") {
      res.status(400).json({ message: "Email is alredy in use" });
      return;
    }
    res.status(500).json({ message: "Server Error" });
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const user = await getUserByEmail(email);
    if (!user) {
      res.status(401).json({ message: "Invalid credentails" });
      return;
    }

    const isValidPassword = await validatePassword(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ message: "Invalid credentails" });
      return;
    }

    const accessToken = await signJWT({ id: user.id }, ACCESS_TOKEN_TTL!);
    const refreshToken = await signJWT({ id: user.id }, REFRESH_TOKEN_TTL!);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 10000, //15 * 60 * 1000, // 15 mins
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30000, //7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: "User logged in successfully",
    });
  } catch (err: any) {
    log.error(`Database error: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
}

export function logoutUser(req: Request, res: Response) {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({ message: "User logged out successfully" });
}

export async function refreshToken(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(401).json({ message: "No refresh token provided" });
      return;
    }

    const { payload } = await verifyJwt(refreshToken);
    if (!payload) {
      res.status(403).json({ message: "Invalid refresh token" });
      return;
    }

    const newAccessToken = await signJWT({ id: payload.id }, ACCESS_TOKEN_TTL!);
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 mins
    });
    res.json({ message: "token refreshed" });
  } catch (err: any) {
    log.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
}
