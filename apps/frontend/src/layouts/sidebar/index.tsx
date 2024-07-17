import SidebarHeader from "./sidebar-header";
import SidebarContent from "./sidebar-content";
import SidebarFooter from "./sidebar-footer";

export default function Sidebar() {
  return (
    <div className="flex size-full flex-col overflow-hidden bg-popover">
      <div className="flex flex-col gap-2 divide-y divide-solid overflow-auto py-2">
        <SidebarHeader />
        <SidebarContent />
      </div>
      <div className="grow basis-0" />
      <SidebarFooter />
    </div>
  );
}
