import { db } from "./index"; // Adjust import based on your project structure
import {
  usersTable,
  conversationsTable,
  participantsTable,
  messagesTable,
} from "./schema";
import { createId } from "@paralleldrive/cuid2";

async function seedDatabase() {
  try {
    console.log("🌱 Seeding database...");

    // Get Users
    const users = await db.select().from(usersTable);

    // Insert Conversations
    const conversations = await db
      .insert(conversationsTable)
      .values([{}, {}])
      .returning({ id: conversationsTable.id });

    console.log("✅ Conversations seeded");

    // Mock Participants
    const participants = [
      { userId: users[0]!.id, conversationId: conversations[0]!.id },
      { userId: users[1]!.id, conversationId: conversations[0]!.id },
      { userId: users[1]!.id, conversationId: conversations[1]!.id },
      { userId: users[2]!.id, conversationId: conversations[1]!.id },
    ];

    // Insert Participants
    await db.insert(participantsTable).values(participants);
    console.log("✅ Participants seeded");

    // Mock Messages
    const messages = [
      {
        conversationId: conversations[0]!.id,
        senderId: users[0]!.id,
        content: `Hey ${users[1]!.name}`,
      },
      {
        conversationId: conversations[0]!.id,
        senderId: users[1]!.id,
        content: `Hey ${users[0]!.name}`,
      },
      {
        conversationId: conversations[1]!.id,
        senderId: users[1]!.id,
        content: `Hey ${users[2]!.name}`,
      },
      {
        conversationId: conversations[1]!.id,
        senderId: users[2]!.id,
        content: `Hey ${users[1]!.name}`,
      },
    ];

    // Insert Messages
    await db.insert(messagesTable).values(messages);
    console.log("✅ Messages seeded");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    process.exit();
  }
}

seedDatabase();
