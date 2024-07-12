import { Navigate, Outlet, useLocation } from "umi";

export default function Auth(props) {
  const location = useLocation();
  const isLogin = true; // TODO: complete auth

  if (isLogin) {
    return <Outlet />;
  } else {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
}
