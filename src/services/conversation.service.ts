import { eq, inArray, sql } from "drizzle-orm";
import { db } from "../db";
import { conversationsTable, participantsTable } from "../db/schema";
import { createConversationBody } from "../schemas/conversation.schema";

export async function createConversation(body: createConversationBody) {
  const [conversation] = await db
    .insert(conversationsTable)
    .values({})
    .returning();

  if (!conversation) return;

  const participantsRecord = body.usersId.map((userId) => ({
    userId,
    conversationId: conversation.id,
  }));
  await db.insert(participantsTable).values(participantsRecord);

  return { conversationId: conversation.id, participants: body.usersId };
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

  console.log({ existingConversation });

  return existingConversation?.conversationId ? true : false;
}
