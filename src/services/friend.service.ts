import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { friendRequestsTable } from "../db/schema";

export async function getFriends(
  userId: string,
  status: "accepted" | "pending" | "rejected",
) {
  if (status === "pending") {
    const friendships = await db.query.friendRequestsTable.findMany({
      where: and(
        eq(friendRequestsTable.recipientId, userId),
        eq(friendRequestsTable.status, status),
      ),
      with: {
        sender: {
          columns: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    return friendships.map((f) => f.sender);
  }

  const friendships = await db.query.friendRequestsTable.findMany({
    where: and(
      eq(friendRequestsTable.senderId, userId),
      eq(friendRequestsTable.status, status),
    ),
    with: {
      recipient: {
        columns: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  return friendships.map((f) => f.recipient);
}

export async function createFriendRequest() {}
