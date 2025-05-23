import z from "zod";

export const createConversationSchema = z.object({
  body: z.object({
    recipientId: z.string().min(1, "A recipientId is required"),
  }),
});

export type CreateConversationBody = z.infer<
  typeof createConversationSchema.shape.body
>;

export const createConversationMessageSchema = z.object({
  body: z.object({
    content: z.string().min(1, "A message is required"),
  }),
  params: z.object({
    conversationId: z.string().min(1, "A conversationId is required"),
  }),
});

export type CreateConversationMessageBody = z.infer<
  typeof createConversationMessageSchema.shape.body
>;

export type CreateConversationMessageParams = z.infer<
  typeof createConversationMessageSchema.shape.params
>;
