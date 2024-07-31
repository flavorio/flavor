import { useNavigate, FormattedMessage } from 'umi';
import { useShallow } from 'zustand/react/shallow';
import { useSpaceStore } from '@/stores/space-store';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@flavor/ui/shadcn';

export default function DocSidebarHeaderLeft() {
  const navigate = useNavigate();
  const [currSpaceId, spaceList, setCurrSpaceId, getSpaceInfo] = useSpaceStore(
    useShallow((state) => [
      state.currSpaceId,
      state.spaceList,
      state.setCurrSpaceId,
      state.getSpaceInfo,
    ]),
  );

  const selectWorkspace = (spaceId: string) => {
    setCurrSpaceId(spaceId);
    getSpaceInfo();
    navigate('/docs');
  };

  return (
    <div className="m-2 flex justify-start items-center">
      <span className="mr-2 text-sm">
        <FormattedMessage id="space.space" />:
      </span>
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
