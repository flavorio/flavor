import SidebarFooter from '@/components/sidebar/sidebar-footer';
import Sidebar from '@/components/sidebar/sidebar';
import DocSidebarHeaderLeft from './doc-sidebar-header-left';
import DocSidebarContent from './doc-sidebar-content';

type DocSidebarProps = {
  className?: string;
};

export default function DocSidebar(props: DocSidebarProps) {
  const { className } = props;

  return (
    <Sidebar className={className} headerLeft={<DocSidebarHeaderLeft />}>
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
