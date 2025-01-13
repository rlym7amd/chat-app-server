import { eq } from "drizzle-orm";
import { db } from "../db/connect";
import { usersTable } from "../db/schema";
import { createUserBody } from "../schemas/user.schema";
import bcrypt from "bcrypt";
import { log } from "../logger";

export async function createUser(input: createUserBody) {
  try {
    const { name, email, password } = input;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userResult = await db
      .insert(usersTable)
      .values({ name, email, password: hashedPassword })
      .returning({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
      });

    return userResult[0];
  } catch (err) {
    if (err instanceof Error) {
      log.error(`Database error: ${err.message}`);
      throw new Error(err.message);
    }
  }
}

export async function getUserByEmail(email: string) {
  try {
    const userResult = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    return userResult[0];
  } catch (err) {
    if (err instanceof Error) {
      log.error(`Database error: ${err.message}`);
      throw new Error(err.message);
    }
  }
}
