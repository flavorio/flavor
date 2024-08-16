import { Sidebar } from '@/blocks/sidebar/sidebar';
import { SidebarFooter } from '@/blocks/sidebar/sidebar-footer';
import { SpaceSidebarHeaderLeft } from './space-sidebar-header-left';
import { SpaceSidebarContent } from './space-sidebar-content';

type SpaceSidebarProps = {
  className?: string;
};

export function SpaceSidebar(props: SpaceSidebarProps) {
  const { className } = props;

  return (
    <Sidebar className={className} headerLeft={<SpaceSidebarHeaderLeft />}>
      <>
        <div className="flex flex-col gap-2 divide-y divide-solid overflow-auto py-2">
          <SpaceSidebarContent />
        </div>
        <div className="grow basis-0" />
        <SidebarFooter />
      </>
    </Sidebar>
  );
}
