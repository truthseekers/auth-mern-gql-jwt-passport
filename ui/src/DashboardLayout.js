import { Outlet } from "react-router-dom";
import DashboardNavBar from "./components/DashboardNavBar";

function DashboardLayout() {
  return (
    <div>
      <DashboardNavBar />
      <Outlet />
    </div>
  );
}

export default DashboardLayout;
