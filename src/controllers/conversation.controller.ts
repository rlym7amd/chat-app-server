import { Request, Response } from "express";
import {
  createConversation,
  isExistingConversation,
} from "../services/conversation.service";
import { log } from "../logger";

export async function createConversationHandler(req: Request, res: Response) {
  try {
    const exits = await isExistingConversation(req.body.usersId);
    if (exits) {
      res.json({ message: "Conversation already exits" });
      return;
    }

    await createConversation(req.body);

    res.status(201).json({ message: "Conversation created successfully" });
  } catch (err: any) {
    log.error(`Database error: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
}
