import { create } from "zustand";
import { produce } from "immer";
import { apiAgent } from "@/api";

type Role = "OWNER";

type Space = {
  id: string;
  name: string;
  role: Role;
};

type SpaceList = Space[];

export type Document = {
  id: string;
  name: string;
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
  setCurrSpaceId: (currSpaceId: string) => void;
  updateDocName: (docId: string, docName: string) => void;
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
        currSpaceInfo: null,
      });
    }
  },
  setCurrSpaceId: (currSpaceId) => {
    set({ currSpaceId });
  },
  updateDocName: (docId, docName) => {
    set(
      produce((state: SpaceState) => {
        const doc = state.currSpaceInfo?.documents.find(
          (doc) => doc.id === docId,
        );
        if (doc) {
          doc.name = docName;
        }
      }),
    );
  },
}));

export function useSpaceList() {
  return useSpaceStore((state) => state.spaceList);
}
