import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { conversationsTable, messagesTable } from "../db/schema";
import { createConversationMessageBody } from "../schemas/conversation.schema";

export async function createConversation(
  creatorId: string,
  recipientId: string
) {
  const [conversation] = await db
    .insert(conversationsTable)
    .values({
      creatorId,
      recipientId,
    })
    .returning();

  if (!conversation) return;

  return conversation;
}

export async function existingConversation(
  creatorId: string,
  recipientId: string
) {
  const existingConversation = await db
    .select()
    .from(conversationsTable)
    .where(
      and(
        eq(conversationsTable.creatorId, creatorId),
        eq(conversationsTable.recipientId, recipientId)
      )
    )
    .limit(1);

  if (existingConversation.length > 0) {
    return existingConversation[0];
  }

  return null;
}

export async function createConversationMessage(
  body: createConversationMessageBody,
  conversationId: string,
  senderId: string
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
