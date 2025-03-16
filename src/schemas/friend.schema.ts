import z from "zod";

export const createFriendRequestSchema = z.object({
  body: z.object({
    email: z.string().min(1, "Email is required").email("Invalid email"),
  }),
});

export type CreateFriendRequestBody = z.infer<
  typeof createFriendRequestSchema.shape.body
>;

export const acceptFriendRequestSchema = z.object({
  body: z.object({
    status: z.string().min(1, "Email is required"),
  }),
});

export type AcceptFriendRequestBody = z.infer<
  typeof acceptFriendRequestSchema.shape.body
>;
