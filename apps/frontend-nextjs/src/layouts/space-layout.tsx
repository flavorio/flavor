import { SpaceSidebar } from './space-sidebar';

export function SpaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full">
      <SpaceSidebar className="z-10" />
      <div className="min-w-80 flex-1 z-0">{children}</div>
    </div>
  );
}
