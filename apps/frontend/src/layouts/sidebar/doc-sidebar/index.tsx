import SidebarFooter from "@/components/sidebar/sidebar-footer";
import Sidebar from "@/components/sidebar/sidebar";
import DocSidebarHeaderLeft from "./doc-sidebar-header-left";
import DocSidebarContent from "./doc-sidebar-content";

export default function DocSidebar() {
  return (
    <Sidebar headerLeft={<DocSidebarHeaderLeft />}>
      <>
        <div className="flex flex-col gap-2 divide-y divide-solid overflow-auto py-2">
          <DocSidebarContent />
        </div>
        <div className="grow basis-0" />
        <SidebarFooter />
      </>
    </Sidebar>
  );
}
