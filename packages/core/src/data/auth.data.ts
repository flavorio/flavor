import { z } from "zod";

export const passwordSchema = z.string().min(8, "Minimum 8 chars");

export const signinSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
});

export type SigninRo = z.infer<typeof signinSchema>;

export const signupSchema = signinSchema;

export type SignupRo = z.infer<typeof signupSchema>;
