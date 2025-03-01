import { eq, inArray, sql } from "drizzle-orm";
import { db } from "../db";
import {
  conversationsTable,
  messagesTable,
  participantsTable,
} from "../db/schema";
import {
  createConversationBody,
  createConversationMessageBody,
} from "../schemas/conversation.schema";

export async function createConversation(
  userId: string,
  body: createConversationBody
) {
  const [conversation] = await db
    .insert(conversationsTable)
    .values({})
    .returning();

  if (!conversation) return;

  const participantsRecord = [
    { userId, conversationId: conversation.id },
    { userId: body.receiptId, conversationId: conversation.id },
  ];

  await db.insert(participantsTable).values(participantsRecord);

  return {
    conversationId: conversation.id,
    participants: [userId, body.receiptId],
  };
}

export async function isExistingConversation(participants: string[]) {
  const [existingConversation] = await db
    .select({ conversationId: participantsTable.conversationId })
    .from(participantsTable)
    .where(inArray(participantsTable.userId, participants))
    .groupBy(participantsTable.conversationId)
    .having(
      sql`COUNT(DISTINCT ${participantsTable.userId}) = ${participants.length}`
    );

  if (!existingConversation?.conversationId) {
    return false;
  }

  return true;
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
