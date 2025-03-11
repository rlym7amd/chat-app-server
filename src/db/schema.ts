import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { pgEnum } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const statusEnum = pgEnum("status", ["pending", "accepted", "rejected"]);

export const friendshipsTable = pgTable("friendships", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  friendId: uuid("friend_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  status: statusEnum().default("pending").notNull(),
});

export const friendshipsRelations = relations(friendshipsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [friendshipsTable.userId],
    references: [usersTable.id],
  }),
  friend: one(usersTable, {
    fields: [friendshipsTable.friendId],
    references: [usersTable.id],
  }),
}));

export const conversationsTable = pgTable("conversations", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const convertionsRelations = relations(
  conversationsTable,
  ({ many }) => ({
    participants: many(participantsTable),
    messages: many(messagesTable),
  }),
);

export const participantsTable = pgTable("participants", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  conversationId: uuid("conversation_id")
    .notNull()
    .references(() => conversationsTable.id, { onDelete: "cascade" }),
});

export const participantsRelations = relations(
  participantsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [participantsTable.userId],
      references: [usersTable.id],
    }),
    conversation: one(conversationsTable, {
      fields: [participantsTable.conversationId],
      references: [conversationsTable.id],
    }),
  }),
);

export const messagesTable = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  content: text("content").notNull(),
  senderId: uuid("sender_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  conversationId: uuid("conversation_id")
    .notNull()
    .references(() => conversationsTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messagesRelations = relations(messagesTable, ({ one }) => ({
  sender: one(usersTable, {
    fields: [messagesTable.senderId],
    references: [usersTable.id],
  }),
  conversation: one(conversationsTable, {
    fields: [messagesTable.conversationId],
    references: [conversationsTable.id],
  }),
}));
