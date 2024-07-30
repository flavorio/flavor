import { Outlet } from 'umi';
import DocSidebar from './sidebar/doc-sidebar';

export default function DocsLayout() {
  return (
    <div className="flex h-screen w-full">
      <DocSidebar className="z-10" />
      <div className="min-w-80 flex-1 z-0">
        <Outlet />
      </div>
    </div>
  );
}
