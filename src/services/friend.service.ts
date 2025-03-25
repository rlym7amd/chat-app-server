import { and, eq, or } from "drizzle-orm";
import { db } from "../db";
import { friendRequestsTable } from "../db/schema";

export async function getFriendRequests(userId: string) {
  return await db.query.friendRequestsTable.findMany({
    where: and(
      eq(friendRequestsTable.recipientId, userId),
      eq(friendRequestsTable.status, "pending")
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
}

export async function createFriendRequest(
  senderId: string,
  recipientId: string
) {
  return await db
    .insert(friendRequestsTable)
    .values({ senderId, recipientId })
    .returning();
}

export async function isExistingFriendRequest(
  senderId: string,
  recipientId: string
) {
  const [friendRequest] = await db
    .select()
    .from(friendRequestsTable)
    .where(
      and(
        eq(friendRequestsTable.senderId, senderId),
        eq(friendRequestsTable.recipientId, recipientId),
        eq(friendRequestsTable.status, "accepted")
      )
    );

  if (!friendRequest) {
    return false;
  }
  return true;
}

export async function isRecipientSentRequest(
  senderId: string,
  recipientId: string
) {
  const [friendRequest] = await db
    .select()
    .from(friendRequestsTable)
    .where(
      and(
        eq(friendRequestsTable.senderId, senderId),
        eq(friendRequestsTable.recipientId, recipientId)
      )
    );

  if (!friendRequest) {
    return false;
  }
  return true;
}

export async function updateFriendRequest(
  friendRequestId: string,
  status: "accepted" | "rejected" | "pending"
) {
  const [friendRequest] = await db
    .update(friendRequestsTable)
    .set({ status })
    .where(eq(friendRequestsTable.id, friendRequestId))
    .returning();

  if (status === "accepted" && friendRequest) {
    await db.insert(friendRequestsTable).values({
      senderId: friendRequest.recipientId,
      recipientId: friendRequest.senderId,
      status,
    });
  }
}

export async function deleteFriendRequest(userId: string, friendId: string) {
  await db
    .delete(friendRequestsTable)
    .where(
      or(
        and(
          eq(friendRequestsTable.senderId, userId),
          eq(friendRequestsTable.recipientId, friendId)
        ),
        and(
          eq(friendRequestsTable.senderId, friendId),
          eq(friendRequestsTable.recipientId, userId)
        )
      )
    );
}

export async function getFriends(userId: string) {
  const acceptedFriendRequests = await db.query.friendRequestsTable.findMany({
    where: and(
      eq(friendRequestsTable.senderId, userId),
      eq(friendRequestsTable.status, "accepted")
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
  return acceptedFriendRequests.map((f) => f.recipient);
}
