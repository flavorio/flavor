import { create } from "zustand";

type UIState = {
  isSpaceMembersModalOpen: boolean;
  setIsSpaceMembersModalOpen: (isSpaceMembersModalOpen: boolean) => void;
};

export const useUIStore = create<UIState>((set, get) => ({
  isSpaceMembersModalOpen: false,

  setIsSpaceMembersModalOpen: (isSpaceMembersModalOpen) => {
    set({ isSpaceMembersModalOpen });
  },
}));
