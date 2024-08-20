import { useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { useTranslation } from 'next-i18next';
import { currSpaceAtom } from '@/stores/space-atoms';
import { getInviteLinks, getSpaceMembers } from '@/stores/space-members-atoms';
import { Invite } from './invite';
import { InviteLink } from './InviteLink';
import { Collaborators } from './Collaborators';

export default function SpaceMemberModalContent() {
  const { t } = useTranslation('common');
  const currSpaceInfo = useAtomValue(currSpaceAtom);
  const currSpaceId = currSpaceInfo?.id;

  useEffect(() => {
    const fetchData = async (currSpaceId: string) => {
      getInviteLinks(currSpaceId);
      getSpaceMembers(currSpaceId);
    };

    currSpaceId && fetchData(currSpaceId);
  }, [currSpaceId]);

  if (!currSpaceInfo) return null;

  const spaceId = currSpaceInfo.id;
  const role = currSpaceInfo.role;

  return (
    <div className="overflow-y-auto">
      <div className="pb-2 text-sm text-muted-foreground">
        {t('space.invite.desc', { count: 1 })}
      </div>
      <div className="space-y-8 py-1">
        <Invite spaceId={spaceId} role={role} />
        <InviteLink spaceId={spaceId} role={role} />
        <div className="w-full">
          <div className="mb-3 text-sm text-muted-foreground">{t('space.invite.spaceTitle')}</div>
          <Collaborators spaceId={spaceId} role={role} />
        </div>
      </div>
    </div>
  );
}
