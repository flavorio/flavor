import { DocSidebar } from './doc-sidebar';

export function DocLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full">
      <DocSidebar className="z-10" />
      <div className="min-w-80 flex-1 z-0">{children}</div>
    </div>
  );
}
