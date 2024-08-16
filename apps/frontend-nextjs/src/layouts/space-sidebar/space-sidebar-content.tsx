import { useAtomValue } from 'jotai';
import { useRouter } from 'next/router';
import { PlusIcon } from '@radix-ui/react-icons';
import { Button } from '@flavor/ui';
import { spaceListAtom } from '@/stores/space-atoms';
import { SpaceItem } from './space-item';

export function SpaceSidebarContent() {
  const router = useRouter();
  const spaceList = useAtomValue(spaceListAtom);

  const addSpace = ({ name }: { name: string }) => {
    //
  };

  return (
    <div className="flex flex-col gap-2 overflow-hidden">
      <div className="px-3">
        <Button
          variant={'outline'}
          size={'sm'}
          className="w-full"
          onClick={() => {
            addSpace({ name: 'new space' });
          }}
        >
          <PlusIcon />
        </Button>
      </div>
      <div className="overflow-y-auto px-3">
        <ul>
          {spaceList?.map((space) => (
            <li key={space.id}>
              <SpaceItem space={space} isActive={space.id === router.query.spaceId} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
