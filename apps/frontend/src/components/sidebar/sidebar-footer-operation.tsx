import { FormattedMessage } from 'umi';
import { DotsHorizontalIcon, PersonIcon } from '@radix-ui/react-icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@flavor/ui/shadcn';
import { useUIStore } from '@/stores/ui-store';

type SidebarFooterOperationProps = {
  className?: string;
};

export default function SidebarFooterOperation(props: SidebarFooterOperationProps) {
  const { className } = props;
  const setIsSpaceMembersModalOpen = useUIStore((state) => state.setIsSpaceMembersModalOpen);

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
          <FormattedMessage id="space.spaceMembers" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
