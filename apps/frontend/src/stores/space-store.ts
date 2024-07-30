import { create } from 'zustand';
import { produce } from 'immer';
import { apiAgent } from '@/api';
import { SpaceRole } from '@flavor/core/auth/role';

type Space = {
  id: string;
  name: string;
  role: SpaceRole;
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
  role: SpaceRole;
};

type InviteLink = {
  createdBy: string;
  createdAt: string;
  invitationCode: string;
  invitationId: string;
  inviteUrl: string;
  role: SpaceRole;
};

type SpaceMember = {
  avatar: string;
  createdAt: string;
  email: string;
  role: SpaceRole;
  userId: string;
  userName: string;
};

type SpaceState = {
  currSpaceId: string | null;
  currSpaceInfo: SpaceInfo | null;
  spaceList: SpaceList;
  inviteLinks: InviteLink[];
  spaceMembers: SpaceMember[];
  getSpaceList: () => Promise<void>;
  getSpaceInfo: () => Promise<void>;
  setCurrSpaceId: (currSpaceId: string) => void;
  updateDocName: (docId: string, docName: string) => void;
  getInviteLinks: () => Promise<void>;
  getSpaceMembers: () => Promise<void>;
  setInviteLinks: (inviteLinks: InviteLink[]) => void;
  setSpaceMembers: (spaceMembers: SpaceMember[]) => void;
};

export const useSpaceStore = create<SpaceState>((set, get) => ({
  currSpaceId: null,
  currSpaceInfo: null,
  spaceList: [],
  inviteLinks: [],
  spaceMembers: [],
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
        const doc = state.currSpaceInfo?.documents.find((doc) => doc.id === docId);
        if (doc) {
          doc.name = docName;
        }
      }),
    );
  },
  getInviteLinks: async () => {
    try {
      const currSpaceId = get().currSpaceId!;
      const res = await apiAgent.space.getSpaceInviteLinks({ id: currSpaceId });
      set({ inviteLinks: res.data });
    } catch (_) {}
  },
  getSpaceMembers: async () => {
    try {
      const currSpaceId = get().currSpaceId!;
      const res = await apiAgent.space.getSpaceMembers({
        id: currSpaceId,
      });
      set({ spaceMembers: res.data });
    } catch (_) {}
  },
  setInviteLinks: (inviteLinks) => {
    set({ inviteLinks });
  },
  setSpaceMembers: (spaceMembers) => {
    set({ spaceMembers });
  },
}));

export function useSpaceList() {
  return useSpaceStore((state) => state.spaceList);
}
