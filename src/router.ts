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
  getConversationsHandler,
} from "./controllers/conversation.controller";
import {
  createFriendRequestHandler,
  deleteFriendRequestHandler,
  getFriendRequestsHanlder,
  getFriendsHandler,
  updateFriendRequestHandler,
} from "./controllers/friend.controller";
import {
  updateFriendRequestSchema,
  createFriendRequestSchema,
  deleteFriendRequestSchema,
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
 * Friend requests routes
 */
router.get("/friend-requests", authenticateToken, getFriendRequestsHanlder);
router.post(
  "/friend-requests",
  authenticateToken,
  validateRequest(createFriendRequestSchema),
  createFriendRequestHandler
);
router.patch(
  "/friend-requests/:friendRequestId",
  authenticateToken,
  validateRequest(updateFriendRequestSchema),
  updateFriendRequestHandler
);
router.delete(
  "/friend-requests",
  authenticateToken,
  validateRequest(deleteFriendRequestSchema),
  deleteFriendRequestHandler
);

/**
 * Friend requests routes
 */
router.get("/friends", authenticateToken, getFriendsHandler);

/**
 * Conversations routes
 */
router.get("/conversations", authenticateToken, getConversationsHandler);
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

export default router;
