import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import { useState } from "react";
import { getUserInfo } from "../services/api";

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const userInfo = getUserInfo();
  const userRole = userInfo?.role;

  return (
    <div className="flex h-screen">
      {userRole === "admin" && (
        <SideBar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      )}

      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen && userRole === "admin" ? "ml-64" : "ml-0"
        } `}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;
