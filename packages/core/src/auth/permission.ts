import { keys } from 'lodash';
import { AllActions } from "./actions";
import { DocumentRole, SpaceRole, spacePermissions } from "./role";

export type PermissionAction = AllActions;

export enum RoleType {
  Space = 'space',
  Document = 'document'
}

export type PermissionMap = Record<PermissionAction, boolean>;

export const getPermissions = (type: RoleType, role?: SpaceRole | DocumentRole) => {
  const permissionMap = getPermissionMap(type, role);
  return (keys(permissionMap) as PermissionAction[]).filter((key) => permissionMap[key]);
};

export const getPermissionMap = (
  type: RoleType,
  role?: SpaceRole | DocumentRole
): PermissionMap => {
  switch (type) {
    case RoleType.Space:
      return spacePermissions[role as SpaceRole] as PermissionMap;
    default:
      return {} as PermissionMap;
  }
};

export const checkPermissions = (role: SpaceRole, actions: PermissionAction[]) => {
  return actions.every((action) => Boolean(spacePermissions[role][action]));
};

export const hasPermission = (role: SpaceRole, action: PermissionAction) => {
  return checkPermissions(role, [action]);
};
