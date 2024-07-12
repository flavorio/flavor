import { Outlet } from "umi";
import { useFetchData } from "@/hooks";
import { useIsLogin } from "@/stores/user-store";

export default function Auth(props) {
  const isLogin = useIsLogin();

  useFetchData();

  if (isLogin) {
    return <Outlet />;
  } else {
    return <div>loading...</div>;
  }
}
