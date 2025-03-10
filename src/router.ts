import { Router } from "express";
import { validateRequest } from "./middleware/validateRequest";
import {
  loginUser,
  logoutUser,
  refreshToken,
  registerUser,
} from "./controllers/auth.controller";
import { loginSchema, registerSchema } from "./schemas/auth.schema";
import { authenticateToken } from "./middleware/authenticateToken";
import {
  getUserFriendListHandler,
  getUserProfile,
} from "./controllers/user.controller";
import {
  createConversationMessageSchema,
  createConversationSchema,
} from "./schemas/conversation.schema";
import {
  createConversationHandler,
  createConversationMessageHandler,
  getConversationByIdHandler,
} from "./controllers/conversation.controller";
import { getPeersHandler } from "./controllers/participants.controller";

const router = Router();

/**
 * Authentication routes
 */
router.post("/auth/register", validateRequest(registerSchema), registerUser);

router.post("/auth/login", validateRequest(loginSchema), loginUser);

router.post("/auth/logout", logoutUser);

router.post("/auth/refresh", refreshToken);

/**
 * Users routes
 */
router.get("/users/me", authenticateToken, getUserProfile);
router.get("/users/me/friends", authenticateToken, getUserFriendListHandler);

/**
 * Conversations routes
 */
router.get(
  "/conversations/:conversationId",
  authenticateToken,
  getConversationByIdHandler
);

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

/**
 * Participants routes
 */
router.get("/participants/peers", authenticateToken, getPeersHandler);

export default router;
