import { Request, Response } from "express";
import { getPeers } from "../services/participants.service";

export async function getPeersHandler(req: Request, res: Response) {
  try {
    const userId = res.locals.user.id;
    const conversations = await getPeers(userId);
    res.json(conversations);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
}
