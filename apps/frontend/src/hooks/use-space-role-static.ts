import { useMemo } from "react";
import { useIntl } from "umi";
import { SpaceRole } from "@flavor/core/auth/role";

export interface ISpaceRoleStatic {
  role: SpaceRole;
  name: string;
  description: string;
  level: number;
}

export const useSpaceRoleStatic = (): ISpaceRoleStatic[] => {
  const intl = useIntl();
  const t = (id: string) => intl.formatMessage({ id });

  return useMemo(() => {
    return [
      {
        role: SpaceRole.Creator,
        name: t("space.spaceRole.role.creator"),
        description: t("space.spaceRole.description.creator"),
        level: 1,
      },
      {
        role: SpaceRole.Editor,
        name: t("space.spaceRole.role.editor"),
        description: t("space.spaceRole.description.editor"),
        level: 2,
      },
      // {
      //   role: SpaceRole.Commenter,
      //   name: t("space.spaceRole.role.commenter"),
      //   description: t("space.spaceRole.description.commenter"),
      //   level: 3,
      // },
      {
        role: SpaceRole.Viewer,
        name: t("space.spaceRole.role.viewer"),
        description: t("space.spaceRole.description.viewer"),
        level: 4,
      },
      {
        role: SpaceRole.Owner,
        name: t("space.spaceRole.role.owner"),
        description: t("space.spaceRole.description.owner"),
        level: 0,
      },
    ];
  }, []);
};
