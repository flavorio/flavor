import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { SpaceLayoutProps } from '@/lib/page-props-type';
import { userAtom } from '@/stores/user-atoms';
import { currSpaceAtom, spaceListAtom } from '@/stores/space-atoms';
import { SpaceSidebar } from './space-sidebar';

type Props = SpaceLayoutProps & {
  children: React.ReactNode;
};

export function SpaceLayout(props: Props) {
  const { children, userInfo, spaceList, currSpace = null } = props;

  useHydrateAtoms([
    [userAtom, userInfo],
    [spaceListAtom, spaceList],
    [currSpaceAtom, currSpace],
  ]);

  const setCurrSpace = useSetAtom(currSpaceAtom);

  // if the initial value used is changed during rerenders,
  // it won't update the atom value.
  useEffect(() => {
    setCurrSpace(currSpace);
  }, [currSpace, setCurrSpace]);

  return (
    <div className="flex h-screen w-full">
      <SpaceSidebar className="z-10" />
      <div className="min-w-80 flex-1 z-0">{children}</div>
    </div>
  );
}
