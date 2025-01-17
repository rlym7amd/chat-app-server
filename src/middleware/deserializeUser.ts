import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils";
import { reIssueAccessToken } from "../services/session.service";

export async function deserializeUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const headers = req.headers;
  const accessToken = headers.authorization?.replace(/^Bearer\s/, "");
  const refreshToken = headers["x-refresh"] as string;

  if (!accessToken) {
    next();
    return;
  }

  const decoded = await verifyJwt(accessToken);

  if (decoded) {
    res.locals.user = decoded.payload;
  }

  if (!decoded && refreshToken) {
    const newAccessToken = await reIssueAccessToken(refreshToken);

    if (!newAccessToken) {
      next();
      return;
    }

    res.setHeader("x-access-token", newAccessToken);
    const decoded = await verifyJwt(newAccessToken);
    console.log(decoded?.payload);

    if (decoded) {
      res.locals.user = decoded.payload;
    }
  }

  next();
}
