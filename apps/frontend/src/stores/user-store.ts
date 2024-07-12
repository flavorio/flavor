import { create } from "zustand";
import { apiAgent } from "@/api";

type LoginParams = { email: string; password: string };

type UserState = {
  isLogin: boolean;
  userInfo: UserInfo | undefined;
  setIsLogin: (isLogin: boolean) => void;
  login: (params: LoginParams) => Promise<void>;
  signup: (params: LoginParams) => Promise<void>;
  getUserInfo: () => Promise<void>;
};

type UserInfo = {
  id: string;
  name: string;
  email: string;
};

export const useUserStore = create<UserState>((set, get) => ({
  isLogin: false,
  userInfo: undefined,
  setIsLogin: (isLogin) => {
    set({ isLogin });
  },
  login: async (params) => {
    try {
      await apiAgent.auth.signin(params);
    } catch (_) {}
  },
  signup: async (params) => {
    try {
      await apiAgent.auth.signup(params);
    } catch (_) {}
  },
  getUserInfo: async () => {
    const res = await apiAgent.user.getUserInfo();
    set({
      userInfo: res.data as UserInfo,
      isLogin: true,
    });
  },
}));

export function useIsLogin() {
  return useUserStore((state) => state.isLogin);
}

export function useUserInfo() {
  return useUserStore((state) => state.userInfo);
}
