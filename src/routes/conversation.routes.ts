import { Router } from "express";
import { authenticateToken } from "../middleware/authenticateToken";
import { validateRequest } from "../middleware/validateRequest";
import { createConversationSchema } from "../schemas/conversation.schema";
import { createConversationHandler } from "../controllers/conversation.controller";

const router = Router();

router.post(
  "/conversations",
  // authenticateToken,
  validateRequest(createConversationSchema),
  createConversationHandler
);

export default router;
