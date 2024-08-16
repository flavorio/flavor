import { atom } from 'jotai';
import { withImmer } from 'jotai-immer';
import { Space, SpaceList } from './store-type';

export const spaceListAtom = atom<SpaceList>([]);

export const currSpaceAtom = atom<Space | null>(null);

export const currSpaceAtomWithImmer = withImmer(currSpaceAtom);
