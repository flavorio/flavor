import { useTranslation } from 'react-i18next';
import { DotsHorizontalIcon, Pencil1Icon } from '@radix-ui/react-icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@flavor/ui';
import { Document } from '@/stores/store-type';

type DocOperationProps = {
  className?: string;
  doc: Document;
  onRename?: () => void;
};

export default function DocOperation(props: DocOperationProps) {
  const { t } = useTranslation('common');
  const { className, doc, onRename } = props;

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
        <DropdownMenuItem onClick={() => onRename?.()}>
          <Pencil1Icon className="mr-2" />
          {t('doc.rename')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
