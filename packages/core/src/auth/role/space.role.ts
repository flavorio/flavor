import { z } from "zod";
import { AllActions } from "../actions";

export enum SpaceRole {
  Owner = "owner",
  Creator = "creator",
  Editor = "editor",
  Viewer = "viewer",
}

export const spaceRolesSchema = z.nativeEnum(SpaceRole);

export type SpacePermission = AllActions;

export const spacePermissions: Record<
  SpaceRole,
  Record<SpacePermission, boolean>
> = {
  [SpaceRole.Owner]: {
    'space|create': true,
    'space|delete': true,
    'space|read': true,
    'space|update': true,
    'space|invite_email': true,
    'space|invite_link': true,
    'space|grant_role': true,
    'document|create': true,
    'document|delete': true,
    'document|read': true,
    'document|update': true,
  },
  [SpaceRole.Creator]: {
    'space|create': false,
    'space|delete': false,
    'space|read': true,
    'space|update': false,
    'space|invite_email': true,
    'space|invite_link': true,
    'space|grant_role': true,
    'document|create': true,
    'document|delete': true,
    'document|read': true,
    'document|update': true,
  },
  [SpaceRole.Editor]: {
    'space|create': false,
    'space|delete': false,
    'space|read': true,
    'space|update': false,
    'space|invite_email': true,
    'space|invite_link': false,
    'space|grant_role': false,
    'document|create': false,
    'document|delete': false,
    'document|read': true,
    'document|update': true,
  },
  [SpaceRole.Viewer]: {
    'space|create': false,
    'space|delete': false,
    'space|read': true,
    'space|update': false,
    'space|invite_email': true,
    'space|invite_link': false,
    'space|grant_role': false,
    'document|create': false,
    'document|delete': false,
    'document|read': true,
    'document|update': false,
  }
};
