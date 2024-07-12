import { create } from "zustand";
import { apiAgent } from "@/api";

type Role = "OWNER";

type Space = {
  id: string;
  name: string;
  role: Role;
};

type SpaceList = Space[];

type Document = {
  //
};

type Documents = Document[];

type SpaceInfo = {
  id: string;
  name: string;
  documents: Documents;
};

type SpaceState = {
  currSpaceId: string | null;
  currSpaceInfo: SpaceInfo | null;
  spaceList: SpaceList;
  getSpaceList: () => Promise<void>;
  getSpaceInfo: () => Promise<void>;
};

export const useSpaceStore = create<SpaceState>((set, get) => ({
  currSpaceId: null,
  currSpaceInfo: null,
  spaceList: [],
  getSpaceList: async () => {
    try {
      const res = await apiAgent.space.getSpaceList();
      set({ spaceList: res.data as SpaceList });
    } catch (e: any) {
      set({
        spaceList: [],
      });
    }
  },
  getSpaceInfo: async () => {
    try {
      const currSpaceId = get().currSpaceId;
      if (currSpaceId) {
        const res = await apiAgent.space.getSpaceInfo({ id: currSpaceId });
        set({ currSpaceInfo: res.data as SpaceInfo });
      }
    } catch (e: any) {
      set({
        spaceList: [],
      });
    }
  },
}));

export function useSpaceList() {
  return useSpaceStore((state) => state.spaceList);
}
