import { z } from "zod";
import { spaceRolesSchema } from "../auth/role/space.role";

export const createSpaceRoSchema = z.object({
  name: z.string()
});

export type CreateSpaceRo = z.infer<typeof createSpaceRoSchema>;

export const spaceVoSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: spaceRolesSchema
});

export type SpaceVo = z.infer<typeof spaceVoSchema>;



