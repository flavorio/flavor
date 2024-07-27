import { mountStoreDevtool } from "simple-zustand-devtools";
import { useUserStore } from "./user-store";
import { useSpaceStore } from "./space-store";
import { usePageStore } from "./page-store";
import { useUIStore } from "./ui-store";

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("userStore", useUserStore);
  mountStoreDevtool("spaceStore", useSpaceStore);
  mountStoreDevtool("pagStore", usePageStore);
  mountStoreDevtool("uiStore", useUIStore);
}
