import type { Request, Response } from "express";
import { getFriends } from "../services/friend.service";

export async function getFriendsHanlder(req: Request, res: Response) {
  try {
    const status = (req.query.status as "rejected" | "pending") || "accepted";
    const userId = res.locals.user.id as string;

    const friends = await getFriends(userId, status);

    res.json({ friends });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
}
