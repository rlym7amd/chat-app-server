import type { Request, Response } from "express";
import {
  createFriendRequest,
  deleteFriendRequest,
  getFriends,
  isExistingFriendRequest,
  isRecipientSentRequest,
  updateFriendRequest,
} from "../services/friend.service";
import {
  CreateFriendRequestBody,
  DeleteFriendRequestBody,
  UpdateFriendRequestBody,
} from "../schemas/friend.schema";
import { getUserByEmail } from "../services/user.service";

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

export async function createFriendRequestHandler(
  req: Request<{}, {}, CreateFriendRequestBody>,
  res: Response
) {
  try {
    const senderId = res.locals.user.id as string;
    const { email } = req.body;

    const recipient = await getUserByEmail(email);
    if (!recipient) {
      res.status(404).json({ message: "User does not exits!" });
      return;
    }

    const exists = await isExistingFriendRequest(senderId, recipient.id);
    if (exists) {
      res
        .status(409)
        .json({ message: `${recipient.name} is already a friend` });
      return;
    }

    const recipientSentRequest = await isRecipientSentRequest(
      recipient.id,
      senderId
    );
    if (recipientSentRequest) {
      res.status(400).json({
        message: `${recipient.name} already sent you a friend request`,
      });
      return;
    }

    await createFriendRequest(senderId, recipient.id);

    res.status(201).json({ message: "Friend request sent!" });
  } catch {
    res.status(500).json({ message: "Server error!" });
  }
}

export async function updateFriendRequestHandler(
  req: Request<{}, {}, UpdateFriendRequestBody>,
  res: Response
) {
  try {
    const recipientId = res.locals.user.id as string;
    const { status, senderId } = req.body;
    await updateFriendRequest(senderId, recipientId, status);

    res.json({ message: `Friend request ${status}!` });
  } catch {
    res.status(500).json({ message: "Server error!" });
  }
}

export async function deleteFriendRequestHandler(
  req: Request<{}, {}, DeleteFriendRequestBody>,
  res: Response
) {
  try {
    const friendId = req.body.friendId;
    const userId = res.locals.user.id;

    await deleteFriendRequest(userId, friendId);

    res.json({ message: "Friend deleted successfully!" });
  } catch {
    res.status(500).json({ message: "Server error!" });
  }
}
