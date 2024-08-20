import { atom } from 'jotai';
import { withImmer } from 'jotai-immer';
import { InviteLink, SpaceMember } from './store-type';
import { apiAgent } from '@/api';
import { store } from '.';
import { currSpaceAtom } from './space-atoms';

export const inviteLinksAtom = atom<InviteLink[]>([]);

export const spaceMembersAtom = atom<SpaceMember[]>([]);

export const inviteLinksAtomWithImmer = withImmer(inviteLinksAtom);

export const spaceMembersAtomWithImmer = withImmer(spaceMembersAtom);

export async function getInviteLinks(spaceId?: string) {
  try {
    const id = spaceId || store.get(currSpaceAtom)?.id;
    if (!id) return;
    const res = await apiAgent.space.getSpaceInviteLinks({
      id,
    });
    store.set(inviteLinksAtom, res.data);
  } catch (_) {}
}

export async function getSpaceMembers(spaceId?: string) {
  try {
    const id = spaceId || store.get(currSpaceAtom)?.id;
    if (!id) return;
    const res = await apiAgent.space.getSpaceMembers({
      id,
    });
    store.set(spaceMembersAtom, res.data);
  } catch (_) {}
}
