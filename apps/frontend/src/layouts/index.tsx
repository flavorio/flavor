import { Outlet } from "umi";
import LeftSidebar from "./sidebar";

export default function Layout() {
  return (
    <div className="flex h-screen w-full">
      <div className="flex border-r flex-shrink-0 h-full w-72">
        <LeftSidebar />
      </div>
      <div className="min-w-80 flex-1">
        <Outlet />
      </div>
    </div>
  );
}
