import { useAtomValue } from 'jotai';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@flavor/ui';
import { currSpaceAtom, spaceListAtom } from '@/stores/space-atoms';

export default function DocSidebarHeaderLeft() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const spaceList = useAtomValue(spaceListAtom);
  const currSpace = useAtomValue(currSpaceAtom);
  const currSpaceId = currSpace?.id;

  const selectWorkspace = (spaceId: string) => {
    router.push(`/space/${spaceId}`);
  };

  return (
    <div className="m-2 flex justify-start items-center">
      <span className="mr-2 text-sm">{t('space.space')}:</span>
      {currSpaceId && (
        <Select value={currSpaceId} onValueChange={selectWorkspace}>
          <SelectTrigger className="h-8 w-[160px]">
            <SelectValue placeholder="select a workspace" />
          </SelectTrigger>
          <SelectContent>
            {spaceList.map((space) => (
              <SelectItem value={space.id} key={space.id}>
                {space.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
