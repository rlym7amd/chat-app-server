import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils";

export async function deserializeUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  const accessToken = authHeader?.replace(/^Bearer\s/, "");

  if (!accessToken) {
    next();
    return;
  }

  const decoded = await verifyJwt(accessToken);

  if (decoded) {
    res.locals.user = decoded.payload;
  }

  next();
}
