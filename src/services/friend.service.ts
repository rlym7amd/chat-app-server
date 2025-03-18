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

export async function createFriendRequest(
  senderId: string,
  recipientId: string,
) {
  return await db
    .insert(friendRequestsTable)
    .values({ senderId, recipientId })
    .returning();
}

export async function isExistingFriendRequest(
  senderId: string,
  recipientId: string,
) {
  const [friendRequest] = await db
    .select()
    .from(friendRequestsTable)
    .where(
      and(
        eq(friendRequestsTable.senderId, senderId),
        eq(friendRequestsTable.recipientId, recipientId),
      ),
    );

  if (!friendRequest) {
    return false;
  }
  return true;
}

export async function isRecipientSentRequest(
  senderId: string,
  recipientId: string,
) {
  const [friendRequest] = await db
    .select()
    .from(friendRequestsTable)
    .where(
      and(
        eq(friendRequestsTable.senderId, senderId),
        eq(friendRequestsTable.recipientId, recipientId),
      ),
    );

  if (!friendRequest) {
    return false;
  }
  return true;
}

export async function updateFriendRequest(
  senderId: string,
  recipientId: string,
  status: "accepted" | "rejected" | "pending",
) {
  if (status === "accepted") {
    await db.insert(friendRequestsTable).values({
      senderId: recipientId,
      recipientId: senderId,
      status,
    });
  }

  await db
    .update(friendRequestsTable)
    .set({ status })
    .where(
      and(
        eq(friendRequestsTable.senderId, senderId),
        eq(friendRequestsTable.recipientId, recipientId),
      ),
    );
}
