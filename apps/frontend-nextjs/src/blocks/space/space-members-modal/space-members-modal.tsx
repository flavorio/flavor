import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@flavor/ui';
import SpaceMemberModalContent from './space-members-content';
import { useAtom } from 'jotai';
import { isSpaceMembersModalOpenAtom } from '@/stores/ui-atoms';
import { useTranslation } from 'next-i18next';

export function SpaceMemberModal() {
  const { t } = useTranslation('common');
  const [isSpaceMembersModalOpen, setIsSpaceMembersModalOpen] = useAtom(
    isSpaceMembersModalOpenAtom,
  );

  const handleOpenChange = (open: boolean) => {
    setIsSpaceMembersModalOpen(open);
  };

  return (
    <Dialog open={isSpaceMembersModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="flex h-[90%] max-w-3xl flex-col">
        <DialogHeader>
          <DialogTitle>{t('space.spaceMembers')}</DialogTitle>
        </DialogHeader>
        <SpaceMemberModalContent />
      </DialogContent>
    </Dialog>
  );
}
