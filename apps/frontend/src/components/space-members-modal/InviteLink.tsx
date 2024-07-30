import { map } from 'lodash';
import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import {
  Button,
  Input,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useToast,
} from '@flavor/ui/shadcn';
import { RoleSelect } from './RoleSelect';
import { getRolesWithLowerPermissions } from './utils';
import { CopyIcon, Cross2Icon } from '@radix-ui/react-icons';
import { SpaceRole } from '@flavor/core/auth';
import { useSpaceRoleStatic, useT } from '@/hooks';
import { useSpaceStore } from '@/stores/space-store';
import { apiAgent } from '@/api';

interface IInviteLink {
  spaceId: string;
  role: SpaceRole;
}

export const InviteLink: React.FC<IInviteLink> = (props) => {
  const { spaceId, role } = props;
  const { toast } = useToast();
  const t = useT();
  const [inviteLinks, getInviteLinks] = useSpaceStore(
    useShallow((state) => [state.inviteLinks, state.getInviteLinks]),
  );

  const updateInviteLink = async (invitationId: string, role: SpaceRole) => {
    await apiAgent.invitation.updateSpaceInviteLink({
      spaceId,
      invitationId,
      role,
    });
    getInviteLinks();
  };
  const updateInviteLinkLoading = false;

  const deleteInviteLink = async (invitationId: string) => {
    await apiAgent.invitation.deleteSpaceInviteLink({ spaceId, invitationId });
    getInviteLinks();
  };
  const deleteInviteLinkLoading = false;

  const copyInviteUrl = async (url: string) => {
    await navigator.clipboard.writeText(url);
    toast({ title: t('space.invite.linkCopySuccess') });
  };

  const spaceRoleStatic = useSpaceRoleStatic();
  const filterRoles = useMemo(
    () => map(getRolesWithLowerPermissions(role, spaceRoleStatic), 'role'),
    [role, spaceRoleStatic],
  );

  if (!inviteLinks?.length) {
    return <></>;
  }

  return (
    <div>
      <div className="mb-3 text-sm text-muted-foreground">{t('space.invite.linkTitle')}</div>
      <div className="space-y-3">
        {inviteLinks.map(({ invitationId, inviteUrl, createdAt, role }) => (
          <div key={invitationId} className="relative flex items-center gap-3 pr-7">
            <div className="flex flex-1 items-center gap-2">
              <Input className="h-8 flex-1" value={inviteUrl} readOnly />
              <CopyIcon
                onClick={() => copyInviteUrl(inviteUrl)}
                className="size-4 cursor-pointer text-muted-foreground opacity-70 hover:opacity-100"
              />
            </div>
            <div className="text-xs text-muted-foreground">
              {t('space.invite.linkCreatedTime', {
                createdTime: createdAt,
              })}
            </div>
            <RoleSelect
              value={role}
              disabled={updateInviteLinkLoading}
              filterRoles={filterRoles}
              onChange={(role) => updateInviteLink(invitationId, role)}
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="absolute right-0 h-auto p-0 hover:bg-inherit"
                    size="sm"
                    variant="ghost"
                    disabled={deleteInviteLinkLoading}
                    onClick={() => deleteInviteLink(invitationId)}
                  >
                    <Cross2Icon className="size-4 cursor-pointer text-muted-foreground opacity-70 hover:opacity-100" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('space.invite.linkRemove')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ))}
      </div>
    </div>
  );
};
