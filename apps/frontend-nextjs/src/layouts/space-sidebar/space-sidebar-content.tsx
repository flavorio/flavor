import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { PlusIcon } from '@radix-ui/react-icons';
import { Button } from '@flavor/ui';
import { spaceListAtom } from '@/stores/space-atoms';
import { SpaceItem } from './space-item';
import { apiAgent } from '@/api';

export function SpaceSidebarContent() {
  const router = useRouter();
  const [spaceList, setSpaceList] = useAtom(spaceListAtom);

  const addSpace = async () => {
    const name = 'New Space';
    await apiAgent.space.createSpace({
      name,
    });
    const newSpaceList = await apiAgent.space.getSpaceList().then(({ data }) => data);
    setSpaceList(newSpaceList);
  };

  return (
    <div className="flex flex-col gap-2 overflow-hidden">
      <div className="px-3">
        <Button
          variant={'outline'}
          size={'sm'}
          className="w-full"
          onClick={() => {
            addSpace();
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
