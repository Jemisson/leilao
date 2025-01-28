import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import { useState } from "react";

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen">
      <SideBar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        } `}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;
