import { Router } from "express";
import { authenticateToken } from "../middleware/authenticateToken";
import { validateRequest } from "../middleware/validateRequest";
import {
  createConversationMessageSchema,
  createConversationSchema,
} from "../schemas/conversation.schema";
import {
  createConversationHandler,
  createConversationMessageHandler,
} from "../controllers/conversation.controller";

const router = Router();

router.post(
  "/conversations",
  authenticateToken,
  validateRequest(createConversationSchema),
  createConversationHandler
);

router.post(
  "/conversations/:conversationId/messages",
  authenticateToken,
  validateRequest(createConversationMessageSchema),
  createConversationMessageHandler
);

export default router;
