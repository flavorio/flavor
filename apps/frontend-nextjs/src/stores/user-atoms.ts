import { atom } from 'jotai';
import { UserInfo } from './store-type';

export const userAtom = atom<UserInfo>({
  id: '',
  name: '',
  email: '',
});
