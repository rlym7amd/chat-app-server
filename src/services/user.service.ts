import { eq, getTableColumns } from "drizzle-orm";
import { db } from "../db";
import { usersTable } from "../db/schema";
import bcrypt from "bcrypt";
import { registerBody } from "../schemas/auth.schema";

export async function createUser(input: registerBody) {
  const { name, email, password } = input;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const [user] = await db
    .insert(usersTable)
    .values({ name, email, password: hashedPassword })
    .returning({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
    });

  return user;
}

export async function getUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  return user;
}

export async function getUserById(id: string) {
  const { password, ...rest } = getTableColumns(usersTable);
  const [user] = await db
    .select({ ...rest })
    .from(usersTable)
    .where(eq(usersTable.id, id));

  return user;
}
