import { and, eq, inArray, notInArray } from "drizzle-orm";
import { db } from "../db";
import { conversationsTable, participantsTable } from "../db/schema";

export async function getPeers(userId: string) {
  // Get all the conversations ids where the user is a participant
  const userConversations = await db
    .select({ conversationsId: participantsTable.conversationId })
    .from(participantsTable)
    .where(eq(participantsTable.userId, userId));

  const conversationIds = userConversations.map((c) => c.conversationsId);

  if (conversationIds.length === 0) return { peers: [] };

  // get all participants in those conversations, excluding the user
  const peers = await db.query.participantsTable.findMany({
    where: and(
      notInArray(participantsTable.userId, [userId]),
      inArray(participantsTable.conversationId, conversationIds)
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

  return { peers };
}
