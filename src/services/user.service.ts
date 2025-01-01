import { db } from "../db/connect";
import { usersTable } from "../db/schema";
import { createUserBody } from "../schemas/user.schema";
import bcrypt from "bcrypt";

export async function createUser(input: createUserBody) {
  try {
    const { name, email, password } = input;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return await db
      .insert(usersTable)
      .values({ name, email, password: hashedPassword })
      .returning({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
      });
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
  }
}
