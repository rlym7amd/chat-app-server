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
        eq(friendRequestsTable.friendId, userId),
        eq(friendRequestsTable.status, status),
      ),
      with: {
        user: {
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

    return friendships.map((f) => f.user);
  }

  const friendships = await db.query.friendRequestsTable.findMany({
    where: and(
      eq(friendRequestsTable.userId, userId),
      eq(friendRequestsTable.status, status),
    ),
    with: {
      friend: {
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

  return friendships.map((f) => f.friend);
}

export async function createFriendRequest() {}
