import { Request, Response, NextFunction } from "express";

export function requireUser(_: Request, res: Response, next: NextFunction) {
  const user = res.locals.user;

  if (!user) {
    res.sendStatus(403);
    return;
  }

  next();
}
