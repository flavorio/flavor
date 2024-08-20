import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useAtom } from 'jotai';
import { FilePlusIcon, PlusIcon } from '@radix-ui/react-icons';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@flavor/ui';
import { apiAgent } from '@/api';
import { currSpaceAtom } from '@/stores/space-atoms';
import { addDoc } from '@/lib/create-doc';
import DocItem from './doc-item';

export default function DocSidebarContent() {
  const { t } = useTranslation('common');
  const [editingId, setEditingId] = useState('');
  const [currSpace, setSpace] = useAtom(currSpaceAtom);

  const handleAddDoc = async () => {
    const spaceId = currSpace?.id;
    if (!spaceId) return;
    await addDoc({ spaceId });
    const spaceInfo = await apiAgent.space.getSpaceInfo({ id: spaceId }).then(({ data }) => data);
    setSpace(spaceInfo);
  };

  return (
    <div className="flex w-full flex-col gap-2 overflow-auto pt-4">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <div className="px-2">
            <Button variant={'outline'} size={'sm'} className={`w-full`}>
              <PlusIcon />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64">
          <DropdownMenuItem onClick={handleAddDoc} className="cursor-pointer">
            <Button variant="ghost" size="sm" className="h-4">
              <FilePlusIcon className="size-4 mr-2" />
              {t('doc.createANewDoc')}
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ul className="mx-2">
        {currSpace?.documents.map((doc) => (
          <DocItem key={doc.id} doc={doc} editingId={editingId} setEditingId={setEditingId} />
        ))}
      </ul>
    </div>
  );
}
