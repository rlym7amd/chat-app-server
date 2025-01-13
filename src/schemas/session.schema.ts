import z from "zod";

export const createSessionSchema = z.object({
  body: z.object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email or password"),
    password: z.string().min(8, "Invalid email or password"),
  }),
});

export type CreateSessionBody = z.infer<typeof createSessionSchema.shape.body>;
