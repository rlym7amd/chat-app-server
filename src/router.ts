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
import { getUserProfile } from "./controllers/user.controller";
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
import {
  createFriendRequestHandler,
  getFriendsHanlder,
} from "./controllers/friend.controller";
import {
  acceptFriendRequestSchema,
  createFriendRequestSchema,
} from "./schemas/friend.schema";

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

/**
 * Friends routes
 */
router.get("/friends", authenticateToken, getFriendsHanlder);
router.post(
  "/friends",
  authenticateToken,
  validateRequest(createFriendRequestSchema),
  createFriendRequestHandler,
);

/**
 * Conversations routes
 */
router.get(
  "/conversations/:conversationId",
  authenticateToken,
  getConversationByIdHandler,
);

router.post(
  "/conversations",
  authenticateToken,
  validateRequest(createConversationSchema),
  createConversationHandler,
);

router.post(
  "/conversations/:conversationId/messages",
  authenticateToken,
  validateRequest(createConversationMessageSchema),
  createConversationMessageHandler,
);

/**
 * Participants routes
 */
router.get("/participants/peers", authenticateToken, getPeersHandler);

export default router;
