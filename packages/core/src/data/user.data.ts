import { z } from 'zod';

export const userInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  hasPassword: z.boolean(),
});

export type UserInfoVo = z.infer<typeof userInfoSchema>;
