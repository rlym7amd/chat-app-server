import { Request, Response } from "express";
import { createUser } from "../services/user.service";
import { createUserBody } from "../schemas/user.schema";
import { log } from "../logger";

export async function createUserHandler(
  req: Request<{}, {}, createUserBody>,
  res: Response
) {
  try {
    const user = await createUser(req.body);

    res.status(201).json(user);
  } catch (err) {
    res.status(409).json("Email already exists!");
  }
}

export function getCurrentUser(req: Request, res: Response) {
  res.json(res.locals.user);
}
