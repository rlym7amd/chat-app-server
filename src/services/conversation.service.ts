import { and, eq, or } from "drizzle-orm";
import { db } from "../db";
import { conversationsTable, messagesTable } from "../db/schema";
import { createConversationMessageBody } from "../schemas/conversation.schema";

export async function createConversation(
  creatorId: string,
  recipientId: string,
) {
  const [conversation] = await db
    .insert(conversationsTable)
    .values({
      creatorId,
      recipientId,
    })
    .returning();

  return conversation;
}

export async function getExistingConversation(
  userId: string,
  friendId: string,
) {
  const existingConversation = await db
    .select()
    .from(conversationsTable)
    .where(
      or(
        and(
          eq(conversationsTable.creatorId, userId),
          eq(conversationsTable.recipientId, friendId),
        ),
        and(
          eq(conversationsTable.creatorId, friendId),
          eq(conversationsTable.recipientId, userId),
        ),
      ),
    )
    .limit(1);

  if (existingConversation.length > 0) {
    return existingConversation[0];
  }
}

export async function getConversations(userId: string) {
  return await db.query.conversationsTable.findMany({
    where: or(
      eq(conversationsTable.creatorId, userId),
      eq(conversationsTable.recipientId, userId),
    ),
    with: {
      recipient: {
        columns: {
          password: false,
        },
      },
      creator: {
        columns: {
          password: false,
        },
      },
    },
  });
}

export async function createConversationMessage(
  body: createConversationMessageBody,
  conversationId: string,
  senderId: string,
) {
  const [message] = await db
    .insert(messagesTable)
    .values({
      content: body.content,
      conversationId,
      senderId,
    })
    .returning();

  return message;
}

export async function getConversationById(conversationId: string) {
  return await db.query.conversationsTable.findFirst({
    where: eq(conversationsTable.id, conversationId),
    with: {
      messages: {
        with: {
          sender: {
            columns: {
              password: false,
            },
          },
        },
      },
    },
  });
}
