import z from "zod";

export const createConversationSchema = z.object({
  body: z.object({
    usersId: z.array(z.string()).min(2, "At least two users required"),
  }),
});

export type createConversationBody = z.infer<
  typeof createConversationSchema.shape.body
>;
