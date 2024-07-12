import { Outlet } from "umi";

export default function Layout() {
  return (
    <div className="layout">
      <div className="layout-left">side bar</div>
      <div className="layout-right">
        <Outlet />
      </div>
    </div>
  );
}
