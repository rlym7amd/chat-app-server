import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { friendshipsTable } from "../db/schema";

export async function getFriends(
  userId: string,
  status: "accepted" | "pending" | "rejected",
) {
  if (status === "pending") {
    const friendships = await db.query.friendshipsTable.findMany({
      where: and(
        eq(friendshipsTable.friendId, userId),
        eq(friendshipsTable.status, status),
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

  const friendships = await db.query.friendshipsTable.findMany({
    where: and(
      eq(friendshipsTable.userId, userId),
      eq(friendshipsTable.status, status),
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
