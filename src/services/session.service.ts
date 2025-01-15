import { log } from "../logger";
import { db } from "../db/connect";
import { sessionsTable } from "../db/schema";
import { eq } from "drizzle-orm";

export async function createSession(userId: string) {
  try {
    const sessionResult = await db
      .insert(sessionsTable)
      .values({
        userId,
      })
      .returning();

    return sessionResult[0];
  } catch (err) {
    if (err instanceof Error) {
      log.error(`Database error: ${err.message}`);
      throw new Error(err.message);
    }
  }
}

export async function getSessions(userId: string) {
  try {
    return await db
      .select()
      .from(sessionsTable)
      .where(eq(sessionsTable.userId, userId));
  } catch (err) {
    if (err instanceof Error) {
      log.error(`Database error: ${err.message}`);
      throw new Error(err.message);
    }
  }
}
