import {
  Button,
  Input,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useToast,
} from "@flavor/ui/shadcn";
import { map } from "lodash";
import { useMemo } from "react";
import { RoleSelect } from "./RoleSelect";
import { getRolesWithLowerPermissions } from "./utils";
import { CopyIcon, Cross2Icon } from "@radix-ui/react-icons";
import { SpaceRole } from "@flavor/core/auth";
import { useSpaceRoleStatic, useT } from "@/hooks";

interface IInviteLink {
  spaceId: string;
  role: SpaceRole;
}

export const InviteLink: React.FC<IInviteLink> = (props) => {
  const { spaceId, role } = props;
  const { toast } = useToast();
  const t = useT();
  const linkList: any[] = [
    {
      invitationId: "invJxGoLZKc8xvI3wxd",
      role: "viewer",
      createdBy: "usr0lfDYZzxy44Owig6",
      createdTime: "2024-07-25T03:47:44.632Z",
      invitationCode:
        "0efd65e253b720bd604751420b0f59a69e46e5935b8c70583857e25e483b7361",
      inviteUrl:
        "https://app.teable.io/invite?invitationId=invJxGoLZKc8xvI3wxd&invitationCode=0efd65e253b720bd604751420b0f59a69e46e5935b8c70583857e25e483b7361",
    },
    {
      invitationId: "invW0Gz2wyhbtAJV0CZ",
      role: "creator",
      createdBy: "usr0lfDYZzxy44Owig6",
      createdTime: "2024-07-26T04:54:09.911Z",
      invitationCode:
        "a3736d7e531bedb99693e9f4058f214607923acc7234bd0088da245959e448c4",
      inviteUrl:
        "https://app.teable.io/invite?invitationId=invW0Gz2wyhbtAJV0CZ&invitationCode=a3736d7e531bedb99693e9f4058f214607923acc7234bd0088da245959e448c4",
    },
  ];

  const updateInviteLink = (arg: any) => {
    //
  };
  const updateInviteLinkLoading = false;

  const deleteInviteLink = (arg: any) => {
    //
  };
  const deleteInviteLinkLoading = false;

  const copyInviteUrl = async (url: string) => {
    await navigator.clipboard.writeText(url);
    toast({ title: t("space.invite.linkCopySuccess") });
  };

  const spaceRoleStatic = useSpaceRoleStatic();
  const filterRoles = useMemo(
    () => map(getRolesWithLowerPermissions(role, spaceRoleStatic), "role"),
    [role, spaceRoleStatic],
  );

  if (!linkList?.length) {
    return <></>;
  }

  return (
    <div>
      <div className="mb-3 text-sm text-muted-foreground">
        {t("space.invite.linkTitle")}
      </div>
      <div className="space-y-3">
        {linkList.map(({ invitationId, inviteUrl, createdTime, role }) => (
          <div
            key={invitationId}
            className="relative flex items-center gap-3 pr-7"
          >
            <div className="flex flex-1 items-center gap-2">
              <Input className="h-8 flex-1" value={inviteUrl} readOnly />
              <CopyIcon
                onClick={() => copyInviteUrl(inviteUrl)}
                className="size-4 cursor-pointer text-muted-foreground opacity-70 hover:opacity-100"
              />
            </div>
            <div className="text-xs text-muted-foreground">
              {t("space.invite.linkCreatedTime", {
                createdTime: createdTime,
              })}
            </div>
            <RoleSelect
              value={role}
              disabled={updateInviteLinkLoading}
              filterRoles={filterRoles}
              onChange={(role) =>
                updateInviteLink({
                  spaceId,
                  invitationId,
                  updateSpaceInvitationLinkRo: { role },
                })
              }
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="absolute right-0 h-auto p-0 hover:bg-inherit"
                    size="sm"
                    variant="ghost"
                    disabled={deleteInviteLinkLoading}
                    onClick={() => deleteInviteLink({ spaceId, invitationId })}
                  >
                    <Cross2Icon className="size-4 cursor-pointer text-muted-foreground opacity-70 hover:opacity-100" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("space.invite.linkRemove")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ))}
      </div>
    </div>
  );
};
