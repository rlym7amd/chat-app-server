import type { Request, Response } from "express";
import { getUserById, getUserFriendsList } from "../services/user.service";

export async function getUserProfile(req: Request, res: Response) {
  try {
    const user = await getUserById(res.locals.user.id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

export async function getUserFriendListHandler(req: Request, res: Response) {
  try {
    const userId = res.locals.user.id as string;

    const friends = await getUserFriendsList(userId);

    res.json({ friends });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
}
