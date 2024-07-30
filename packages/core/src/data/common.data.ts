import { z } from 'zod';

export const idSchema = z.object({
  id: z.string(),
});

export type IdRo = z.infer<typeof idSchema>;
