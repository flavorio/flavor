import { useHydrateAtoms } from 'jotai/utils';
import { DocPageProps } from '@/lib/page-props-type';
import { userAtom } from '@/stores/user-atoms';
import { currSpaceAtom, spaceListAtom } from '@/stores/space-atoms';
import { DocSidebar } from './doc-sidebar';

type Props = DocPageProps & {
  children: React.ReactNode;
};

export function DocLayout(props: Props) {
  const { userInfo, spaceList, currSpace, children } = props;

  useHydrateAtoms([
    [userAtom, userInfo],
    [spaceListAtom, spaceList],
    [currSpaceAtom, currSpace],
  ]);

  return (
    <div className="flex h-screen w-full">
      <DocSidebar className="z-10" />
      <div className="min-w-80 flex-1 z-0">{children}</div>
    </div>
  );
}
