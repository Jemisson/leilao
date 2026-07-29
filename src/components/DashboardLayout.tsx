import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import { useState } from "react";
import { getUserInfo } from "../services/api";

function DashboardLayout({ children }: { children?: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const userInfo = getUserInfo();
  const userRole = userInfo?.role;

  return (
    <div className="mx-auto flex w-[90%] flex-1 items-start gap-6 py-6">
      {userRole === "admin" && (
        <SideBar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      )}

      <div className="min-w-0 flex-1">
        {children || <Outlet />}
      </div>
    </div>
  );
}

export default DashboardLayout;
