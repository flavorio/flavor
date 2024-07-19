import { create } from "zustand";
import { produce } from "immer";
import { HistoryEntry } from "tldraw";
import { apiAgent } from "@/api";

type PageState = {
  pageId: string;
  pageData: { schema: any; store: any };
  pageStatus: "idle" | "loading" | "succeed" | "failed";
  setPageId: (pageId: string) => void;
  getPageData: () => Promise<void>;
  updatePageData: (update: HistoryEntry) => void;
};

export const usePageStore = create<PageState>()((set, get) => ({
  pageId: "",
  pageData: { schema: null, store: null },
  pageStatus: "idle" as const,
  setPageId: (newPageId) => {
    const { pageId, getPageData } = get();
    if (newPageId && newPageId !== pageId) {
      set({ pageId: newPageId });
      getPageData();
    }
  },
  getPageData: async () => {
    set({ pageStatus: "loading" });
    try {
      const res = await apiAgent.document.getDocument({ id: get().pageId });
      set({ pageData: res.data, pageStatus: "succeed" });
    } catch (_) {
      set({ pageStatus: "failed" });
    }
  },
  updatePageData: (update) => {
    set(
      produce((state: PageState) => {
        const store = state.pageData.store;
        const { added, removed, updated } = update.changes;

        Object.values(added).forEach((item) => {
          store[item.id] = item;
        });

        Object.values(removed).forEach((item) => {
          delete store[item.id];
        });

        Object.values(updated).forEach(([from, to]) => {
          store[to.id] = to;
        });
      }),
    );
  },
}));
