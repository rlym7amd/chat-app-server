import { drizzle } from "drizzle-orm/node-postgres";
import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("error", (err) => {
  console.error("Database connection failed:", err.message);
  process.exit(1);
});

export async function connect() {
  try {
    const client = await pool.connect();
    console.log("Database connected successfully!");
    client.release();
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Database connection failed:", err.message);
    } else {
      console.error("Unknown error during database connection");
    }
    process.exit(1);
  }
}

export const db = drizzle({ client: pool });
