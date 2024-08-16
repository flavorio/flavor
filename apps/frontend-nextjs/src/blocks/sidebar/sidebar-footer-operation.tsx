import { useSetAtom } from 'jotai';
import { useTranslation } from 'react-i18next';
import { DotsHorizontalIcon, PersonIcon } from '@radix-ui/react-icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@flavor/ui';
import { isSpaceMembersModalOpenAtom } from '@/stores/ui-atoms';

type SidebarFooterOperationProps = {
  className?: string;
};

export function SidebarFooterOperation(props: SidebarFooterOperationProps) {
  const { className } = props;
  const { t } = useTranslation('common');
  const setIsSpaceMembersModalOpen = useSetAtom(isSpaceMembersModalOpenAtom);

  const openSpaceMembers = () => {
    setIsSpaceMembersModalOpen(true);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <DotsHorizontalIcon className={className} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[160px]"
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenuItem onClick={openSpaceMembers}>
          <PersonIcon className="mr-2" />
          {t('space.spaceMembers')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
