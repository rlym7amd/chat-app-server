import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { pgEnum } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { unique } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const statusEnum = pgEnum("status", ["pending", "accepted", "rejected"]);

export const friendRequestsTable = pgTable("friend_Requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  senderId: uuid("sender_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  recipientId: uuid("recipient_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  status: statusEnum().default("pending").notNull(),
});

export const friendRequestsRelations = relations(
  friendRequestsTable,
  ({ one }) => ({
    sender: one(usersTable, {
      fields: [friendRequestsTable.senderId],
      references: [usersTable.id],
    }),
    recipient: one(usersTable, {
      fields: [friendRequestsTable.recipientId],
      references: [usersTable.id],
    }),
  })
);

export const conversationsTable = pgTable(
  "conversations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    creatorId: uuid("creator_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    recipientId: uuid("recipient_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      uniqueConversation: unique().on(table.creatorId, table.recipientId), // Ensures one conversation per user pair
    };
  }
);

export const convertionsRelations = relations(
  conversationsTable,
  ({ many }) => ({
    messages: many(messagesTable),
  })
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
