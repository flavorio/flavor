import { debounce } from "lodash";
import type { FC, PropsWithChildren } from "react";
import React, { useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { Cross2Icon } from "@radix-ui/react-icons";
import {
  Button,
  Input,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@flavor/ui/shadcn";
import { hasPermission, SpaceRole } from "@flavor/core/auth";
import { ListSpaceCollaboratorVo } from "@flavor/core/space";
import { useT } from "@/hooks";
import { apiAgent } from "@/api";
import { Collaborator } from "./Collaborator";
import { RoleSelect } from "./RoleSelect";
import { useUserInfo } from "@/stores/user-store";
import { useSpaceStore } from "@/stores/space-store";

interface ICollaborators {
  spaceId: string;
  role: SpaceRole;
}

const filterSpaceMembers = (
  search: string,
  spaceMembers?: ListSpaceCollaboratorVo,
) => {
  if (!search) return spaceMembers;
  return spaceMembers?.filter(({ userName, email }) => {
    const searchLower = search.toLowerCase();
    const usernameLower = userName.toLowerCase();
    const emailLower = email.toLowerCase();
    return (
      !search ||
      usernameLower.includes(searchLower) ||
      emailLower.includes(searchLower)
    );
  });
};

export const Collaborators: FC<PropsWithChildren<ICollaborators>> = (props) => {
  const { spaceId, role, children } = props;

  const t = useT();
  const user = useUserInfo();
  const [spaceMembers, getSpaceMembers] = useSpaceStore(
    useShallow((state) => [state.spaceMembers, state.getSpaceMembers]),
  );

  const [search, setSearch] = useState<string>("");
  const [applySearch, setApplySearch] = useState<string>(search);

  const updateCollaborator = async (
    spaceId: string,
    userId: string,
    role: SpaceRole,
  ) => {
    await apiAgent.space.updateSpaceMember({ spaceId, userId, role });
    getSpaceMembers();
  };
  const updateCollaboratorLoading = false;

  const deleteCollaborator = async (spaceId: string, userId: string) => {
    await apiAgent.space.deleteSpaceMember({ spaceId, userId });
    getSpaceMembers();
  };
  const deleteCollaboratorLoading = false;

  const collaboratorsFiltered = useMemo(() => {
    return filterSpaceMembers(applySearch, spaceMembers);
  }, [applySearch, spaceMembers]);

  const hasGrantRolePermission = hasPermission(role, "space|grant_role");

  const setApplySearchDebounced = useMemo(() => {
    return debounce(setApplySearch, 200);
  }, []);

  return (
    <div>
      <div className="mb-6 flex items-center gap-x-4">
        <Input
          className="h-8"
          type="search"
          placeholder={t("space.invite.collaboratorSearchPlaceholder")}
          value={search}
          onChange={(e) => {
            const value = e.target.value;
            setSearch(value);
            setApplySearchDebounced(value);
          }}
        />
        {children}
      </div>
      <div className="space-y-5">
        {collaboratorsFiltered?.map(
          ({ userId, userName, email, role, avatar, createdAt }) => (
            <div key={userId} className="relative flex items-center gap-3 pr-6">
              <Collaborator name={userName} email={email} avatar={avatar} />
              <div className="text-xs text-muted-foreground">
                {t("space.invite.collaboratorJoin", {
                  joinTime: createdAt,
                })}
              </div>
              <RoleSelect
                value={role}
                disabled={
                  updateCollaboratorLoading ||
                  userId === user?.id ||
                  !hasGrantRolePermission
                }
                onChange={(role) => updateCollaborator(spaceId, userId, role)}
              />
              {userId !== user?.id && hasGrantRolePermission && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="absolute right-0 h-auto p-0 hover:bg-inherit"
                        size="sm"
                        variant="ghost"
                        disabled={deleteCollaboratorLoading}
                        onClick={() => deleteCollaborator(spaceId, userId)}
                      >
                        <Cross2Icon className="size-4 cursor-pointer text-muted-foreground opacity-70 hover:opacity-100" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t("space.invite.collaboratorRemove")}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          ),
        )}
      </div>
    </div>
  );
};
