import React from 'react';
import { useTranslation } from 'next-i18next';
import { useAtomValue } from 'jotai';
import { Button } from '@flavor/ui';
import { spaceListAtom } from '@/stores/space-atoms';

export function AllSpace() {
  const { t } = useTranslation('common');
  const spaceList = useAtomValue(spaceListAtom);

  const createSpace = () => {};

  return (
    <div className="flex h-screen flex-1 flex-col overflow-hidden py-8">
      <div className="flex items-center justify-between px-12">
        <h1 className="text-2xl font-semibold">{t('space.allSpaces')}</h1>
        <Button size={'sm'} onClick={() => createSpace()}>
          {t('space.actions.createSpace')}
        </Button>
      </div>
      <div className="flex-1 space-y-8 overflow-y-auto px-8 pt-8 sm:px-12">
        {spaceList.map((space) => (
          <div key={space.id}>{space.name}</div>
        ))}
      </div>
    </div>
  );
}
