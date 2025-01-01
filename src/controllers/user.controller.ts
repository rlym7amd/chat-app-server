import { Request, Response } from "express";
import { createUser } from "../services/user.service";
import { createUserBody } from "../schemas/user.schema";

export async function createUserHandler(
  req: Request<{}, {}, createUserBody>,
  res: Response
) {
  try {
    const user = await createUser(req.body);

    res.status(201).json(user);
  } catch (err) {
    if (err instanceof Error) {
      res.status(409).send(err.message);
      return;
    }

    res.status(409).send("Unknown error during user creation");
  }
}
