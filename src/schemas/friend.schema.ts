import z from "zod";

export const createFriendRequestSchema = z.object({
  body: z.object({
    email: z.string().min(1, "Email is required").email("Invalid email"),
  }),
});

export type CreateFriendRequestBody = z.infer<
  typeof createFriendRequestSchema.shape.body
>;

export const updateFriendRequestSchema = z.object({
  body: z.object({
    senderId: z.string().min(1, "senderId is required"),
    status: z.union([
      z.literal("accepted"),
      z.literal("rejected"),
      z.literal("pending"),
    ]),
  }),
});

export type UpdateFriendRequestBody = z.infer<
  typeof updateFriendRequestSchema.shape.body
>;

export const deleteFriendRequestSchema = z.object({
  body: z.object({
    friendId: z.string().min(1, "friendId is required"),
  }),
});

export type DeleteFriendRequestBody = z.infer<
  typeof deleteFriendRequestSchema.shape.body
>;
