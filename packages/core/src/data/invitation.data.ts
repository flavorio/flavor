import { z } from "zod";
import { spaceRolesSchema } from "../auth/role/space.role";
import { IdPrefix } from "../utils/id-generator";

export const createSpaceInvitationLinkRoSchema = z.object({
  spaceId: z.string(),
  role: spaceRolesSchema,
});

export type CreateSpaceInvitationLinkRo = z.infer<typeof createSpaceInvitationLinkRoSchema>;

export const deleteSpaceInvitationLinkRoSchema = z.object({
  spaceId: z.string(),
  invitationId: z.string(),
});

export type DeleteSpaceInvitationLinkRo = z.infer<typeof deleteSpaceInvitationLinkRoSchema>;


export const updateSpaceInvitationLinkRoSchema = z.object({
  spaceId: z.string(),
  invitationId: z.string(),
  role: spaceRolesSchema
});

export type UpdateSpaceInvitationLinkRo = z.infer<typeof updateSpaceInvitationLinkRoSchema>;


export const acceptInvitationLinkRoSchema = z.object({
  invitationCode: z.string(),
  invitationId: z.string().startsWith(IdPrefix.Invitation),
});


export type AcceptInvitationLinkRo = z.infer<typeof acceptInvitationLinkRoSchema>;
