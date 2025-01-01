import z from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email"),
    password: z.string().min(8, "Password must contian 8 characters"),
  }),
});

export type createUserBody = z.infer<typeof createUserSchema.shape.body>;
