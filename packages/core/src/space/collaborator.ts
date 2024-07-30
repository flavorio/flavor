import { z } from 'zod';
import { spaceRolesSchema } from '../auth';

export const itemSpaceCollaboratorSchema = z.object({
  userId: z.string(),
  userName: z.string(),
  email: z.string(),
  role: spaceRolesSchema,
  avatar: z.string().nullable(),
  createdAt: z.string(),
});

export type ItemSpaceCollaboratorVo = z.infer<typeof itemSpaceCollaboratorSchema>;

export const listSpaceCollaboratorVoSchema = z.array(itemSpaceCollaboratorSchema);

export type ListSpaceCollaboratorVo = z.infer<typeof listSpaceCollaboratorVoSchema>;
