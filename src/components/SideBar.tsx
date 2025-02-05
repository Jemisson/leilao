import { FaMoneyBill } from "react-icons/fa";
import { IoBagHandle } from "react-icons/io5";
import MenuItem from "./MenuItem";
import { MdDashboard } from "react-icons/md";
import { SideBarProps } from "../types";
import { BsPersonLinesFill } from "react-icons/bs";

function SideBar({ isSidebarOpen, setIsSidebarOpen }: SideBarProps) {
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="absolute top-4 left-4 z-50 p-2 rounded-md bg-redDark text-white md:hidden"
      >
        <svg
          className="w-6 h-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>

      <aside
        className={`fixed top-16 left-0 z-40 h-screen bg-white border-r border-gray-200 shadow-md transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-64`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          <ul className="space-y-4">
            <MenuItem to="/dashboard" icon={<MdDashboard />} label="Dashboard" />
            <MenuItem to="/dashboard/produtos" icon={<IoBagHandle />} label="Produtos" />
            <MenuItem to="/dashboard/historico" icon={<FaMoneyBill />} label="Todos os Lances" />
            <MenuItem to="/dashboard/licitantes" icon={<BsPersonLinesFill />} label="Licitantes" />
          </ul>
        </div>
      </aside>
    </>
  );
}

export default SideBar;
