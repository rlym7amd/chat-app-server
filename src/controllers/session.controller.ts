import { Request, Response } from "express";
import {
  createSession,
  getSessions,
  updateSession,
} from "../services/session.service";
import { getUserByEmail } from "../services/user.service";
import { signJWT, validatePassword } from "../utils";

export async function createUserSessionHandler(req: Request, res: Response) {
  const user = await getUserByEmail(req.body.email);
  if (!user) {
    res.status(401).json("Invalid email or password");
    return;
  }

  const { password, ...userWithoutPassword } = user;
  const isValid = await validatePassword(req.body.password, password);
  if (!isValid) {
    res.status(401).json("Invalid email or password");
    return;
  }

  try {
    const session = await createSession(user.id);

    const accessTokenTtl = process.env.ACCESS_TOKEN_TTL as string;
    const accessToken = await signJWT(
      { ...userWithoutPassword, session: session?.id },
      accessTokenTtl
    );

    const refreshTokenTtl = process.env.REFRESH_TOKEN_TTL as string;
    const refreshToken = await signJWT(
      { ...userWithoutPassword, session: session?.id },
      refreshTokenTtl
    );

    res.status(201).json({ accessToken, refreshToken });
  } catch {
    res.status(409).json("Could not log in properly, please try again");
  }
}

export async function getUserSessionHandler(req: Request, res: Response) {
  const userId = res.locals.user.id;

  const sessions = await getSessions(userId);

  res.json(sessions);
}

export async function deleteUserSessionHandler(req: Request, res: Response) {
  const sessionId = res.locals.user.session;

  await updateSession(sessionId);

  res.json({ accessToken: null, refreshToken: null });
}
