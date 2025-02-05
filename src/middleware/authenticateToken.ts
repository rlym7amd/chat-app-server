import type { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils";

export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      res
        .status(401)
        .json({ message: "Unauthenticated, no token was provided" });
      return;
    }

    const { payload } = await verifyJwt(accessToken);
    if (!payload) {
      res
        .status(401)
        .json({ message: "Unauthenticated, expired or invalid token" });
      return;
    }

    res.locals.user = { id: payload.id };
    next();
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}
