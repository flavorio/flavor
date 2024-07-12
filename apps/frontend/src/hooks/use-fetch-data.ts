import { useEffect } from "react";
import { useLocation, useNavigate } from "umi";
import { useShallow } from "zustand/react/shallow";
import { useUserStore } from "@/stores/user-store";
import { useSpaceStore } from "@/stores/space-store";

export function useFetchData() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogin, getUserInfo] = useUserStore(
    useShallow((state) => [state.isLogin, state.getUserInfo]),
  );
  const [getSpaceList, getSpaceInfo] = useSpaceStore((state) => [
    state.getSpaceList,
    state.getSpaceInfo,
  ]);

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        await getUserInfo();
      } catch (err) {
        navigate("/login", { state: { from: location } });
      }
    }

    async function fetchSpaceData() {
      try {
        await getSpaceList();
        await getSpaceInfo();
      } catch (_) {}
    }

    !isLogin && fetchUserInfo();

    isLogin && fetchSpaceData();
  }, [isLogin]);
}
