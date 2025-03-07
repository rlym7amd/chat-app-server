import { db } from "./index"; // Adjust import based on your project structure
import {
  usersTable,
  conversationsTable,
  participantsTable,
  messagesTable,
  friendshipsTable,
} from "./schema";
import bcrypt from "bcrypt";

async function seedDatabase() {
  try {
    console.log("🌱 Seeding database...");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password", salt);

    // Mock Users
    const mockUsers = [
      {
        name: "Jhon Doe",
        email: "jhon@example.com",
        password: hashedPassword,
      },
      {
        name: "Kelly Wakasa",
        email: "kelly@example.com",
        password: hashedPassword,
      },
      {
        name: "Jane Doe",
        email: "jane@example.com",
        password: hashedPassword,
      },
      {
        name: "Luke Eich",
        email: "luke@example.com",
        password: hashedPassword,
      },
    ];

    // Insert Users
    const users = await db.insert(usersTable).values(mockUsers).returning();

    console.log("✅ Users seeded");

    // Mock Friendships
    const friendships = [
      {
        userId: users[0]!.id,
        friendId: users[1]!.id,
      },
      {
        userId: users[0]!.id,
        friendId: users[2]!.id,
      },
      {
        userId: users[0]!.id,
        friendId: users[3]!.id,
      },
      {
        userId: users[1]!.id,
        friendId: users[0]!.id,
      },
      {
        userId: users[2]!.id,
        friendId: users[0]!.id,
      },
      {
        userId: users[3]!.id,
        friendId: users[0]!.id,
      },
    ];

    // Insert Friendships
    await db.insert(friendshipsTable).values(friendships);
    await db.update(friendshipsTable).set({ status: "accepted" });

    console.log("✅ Friendships seeded");

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
      { userId: users[0]!.id, conversationId: conversations[1]!.id },
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
        senderId: users[0]!.id,
        content: `Hey ${users[2]!.name}`,
      },
      {
        conversationId: conversations[1]!.id,
        senderId: users[2]!.id,
        content: `Hey ${users[0]!.name}`,
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
