import { log } from "../logger";
import { db } from "../db/connect";
import { sessionsTable, usersTable } from "../db/schema";
import { eq } from "drizzle-orm";
import { signJWT, verifyJwt } from "../utils";

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

export async function updateSession(id: string) {
  await db.update(sessionsTable).set({ valid: false });
}

export async function reIssueAccessToken(refreshToken: string) {
  const decoded = await verifyJwt(refreshToken);

  if (!decoded || !decoded.payload) {
    return null;
  }

  const sessionId = decoded.payload.session as string;

  const sessionResult = await db
    .select()
    .from(sessionsTable)
    .where(eq(sessionsTable.id, sessionId));

  const session = sessionResult[0];

  if (!session?.valid) {
    return null;
  }

  const userResult = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      createdAt: usersTable.createdAt,
      updatedAt: usersTable.updatedAt,
    })
    .from(usersTable)
    .where(eq(usersTable.id, session.userId));

  const user = userResult[0];
  if (!user) {
    return null;
  }

  const accessTokenTtl = process.env.ACCESS_TOKEN_TTL as string;
  const accessToken = await signJWT(
    { ...user, session: session.id },
    accessTokenTtl
  );

  return accessToken;
}
