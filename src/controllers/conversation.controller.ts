import { Request, Response } from "express";
import {
  createConversation,
  createConversationMessage,
  getConversationById,
  isExistingConversation,
} from "../services/conversation.service";
import { log } from "../logger";

export async function createConversationHandler(req: Request, res: Response) {
  try {
    const userId = res.locals.user.id as string;
    const exits = await isExistingConversation([userId, req.body.receiptId]);
    if (exits) {
      res.status(409).json({ message: "Conversation already exits" });
      return;
    }

    await createConversation(userId, req.body);

    res.status(201).json({ message: "Conversation created successfully" });
  } catch (err: any) {
    log.error(`Database error: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
}

export async function createConversationMessageHandler(
  req: Request,
  res: Response
) {
  const body = req.body;
  const { conversationId } = req.params;
  const userId = res.locals.user.id as string;

  if (!conversationId) {
    res.json({ message: "Conversation id not provided" });
    return;
  }
  await createConversationMessage(body, conversationId, userId);

  res.status(201).json({ message: "Message created successfully" });
}

export async function getConversationByIdHandler(req: Request, res: Response) {
  try {
    const { conversationId } = req.params;

    if (!conversationId) {
      res.status(400).json({ message: "conversationId param required" });
      return;
    }

    const conversation = await getConversationById(conversationId);

    res.json(conversation);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
}
