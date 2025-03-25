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
    status: z.union([
      z.literal("accepted"),
      z.literal("rejected"),
      z.literal("pending"),
    ]),
  }),
  params: z.object({
    friendRequestId: z.string().min(1, "friendRequestId params is required"),
  }),
});

export type UpdateFriendRequestBody = z.infer<
  typeof updateFriendRequestSchema.shape.body
>;

export type UpdateFriendRequestParams = z.infer<
  typeof updateFriendRequestSchema.shape.params
>;

export const deleteFriendRequestSchema = z.object({
  body: z.object({
    friendId: z.string().min(1, "friendId is required"),
  }),
});

export type DeleteFriendRequestBody = z.infer<
  typeof deleteFriendRequestSchema.shape.body
>;
