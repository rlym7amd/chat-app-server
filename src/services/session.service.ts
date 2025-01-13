import { log } from "../logger";
import { db } from "../db/connect";
import { sessionsTable } from "../db/schema";

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
