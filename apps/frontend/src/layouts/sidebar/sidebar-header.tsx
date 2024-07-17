import { FormattedMessage } from "umi";
import { useShallow } from "zustand/react/shallow";
import { useSpaceStore } from "@/stores/space-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@flavor/ui/shadcn";

export default function SidebarHeader() {
  const [currSpaceInfo, spaceList, setCurrSpaceId, getSpaceInfo] =
    useSpaceStore(
      useShallow((state) => [
        state.currSpaceInfo,
        state.spaceList,
        state.setCurrSpaceId,
        state.getSpaceInfo,
      ]),
    );

  const selectWorkspace = (spaceId: string) => {
    setCurrSpaceId(spaceId);
    getSpaceInfo();
  };

  return (
    <div className="m-2 flex justify-start items-center">
      <span className="mr-2">
        <FormattedMessage id="space.space" />: 
      </span>
      {currSpaceInfo?.id && (
        <Select
          defaultValue={currSpaceInfo?.id}
          onValueChange={selectWorkspace}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="select a workspace" />
          </SelectTrigger>
          <SelectContent defaultValue={currSpaceInfo?.id}>
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
