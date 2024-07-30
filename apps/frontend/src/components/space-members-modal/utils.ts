import { ISpaceRoleStatic } from '@/hooks';
import { SpaceRole } from '@flavor/core/auth/role';

export const getRolesWithLowerPermissions = (
  role: SpaceRole,
  spaceRoleStatic: ISpaceRoleStatic[],
  includeRole: boolean = true,
) => {
  const roleLevel = spaceRoleStatic.find((spaceRole) => spaceRole.role === role)?.level;
  if (roleLevel == undefined) {
    return [];
  }
  return spaceRoleStatic.filter(({ level }) =>
    includeRole ? level >= roleLevel : level > roleLevel,
  );
};

export const getRolesWithHigherPermissions = (
  role: SpaceRole,
  spaceRoleStatic: ISpaceRoleStatic[],
  includeRole: boolean = true,
) => {
  const roleLevel = spaceRoleStatic.find((spaceRole) => spaceRole.role === role)?.level;
  if (roleLevel == undefined) {
    return [];
  }
  return spaceRoleStatic.filter(({ level }) =>
    includeRole ? level <= roleLevel : level < roleLevel,
  );
};
