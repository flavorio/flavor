import React from 'react';
import { useTranslation } from 'next-i18next';
import { currSpaceAtom } from '@/stores/space-atoms';
import { useAtom } from 'jotai';
import { DocList } from './doc-list';
import { Button } from '@flavor/ui/shadcn';
import { addDoc } from '@/lib/create-doc';
import { apiAgent } from '@/api';

export function SpaceInfo() {
  const { t } = useTranslation('common');
  const [space, setSpace] = useAtom(currSpaceAtom);

  const handleCreateDocClick = async () => {
    const spaceId = space?.id;
    if (!spaceId) return;
    await addDoc({ spaceId });
    const spaceInfo = await apiAgent.space.getSpaceInfo({ id: spaceId }).then(({ data }) => data);
    setSpace(spaceInfo);
  };

  return (
    space && (
      <div className="flex size-full min-w-[760px] overflow-y-auto px-12 py-8">
        <div className="w-full flex-1 space-y-6">
          <div className="flex items-center gap-2 pb-6">
            <h1 className="text-2xl font-semibold">{space.name}</h1>
          </div>

          {space.documents?.length ? (
            <DocList documents={space.documents} />
          ) : (
            <div className="flex items-center justify-center">
              <h1>{t('space.spaceIsEmpty')}</h1>
            </div>
          )}
        </div>

        <div className="ml-16 w-72 min-w-60">
          <div className="flex shrink-0 items-center justify-end gap-3 pb-8">
            <Button onClick={handleCreateDocClick}>{t('doc.createANewDoc')}</Button>
          </div>
          <div className="text-left">{/* collaborators */}</div>
        </div>
      </div>
    )
  );
}
