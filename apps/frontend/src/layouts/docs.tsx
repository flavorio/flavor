import { Outlet } from "umi";
import DocSidebar from "./sidebar/doc-sidebar";

export default function Layout() {
  return (
    <div className="flex h-screen w-full">
      <DocSidebar />
      <div className="min-w-80 flex-1">
        <Outlet />
      </div>
    </div>
  );
}
