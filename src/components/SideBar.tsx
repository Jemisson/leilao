import { NavLink } from "react-router-dom";
import { Dispatch, SetStateAction } from "react";
import { FaMoneyBill } from "react-icons/fa";

interface SideBarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

function SideBar({ isSidebarOpen, setIsSidebarOpen }: SideBarProps) {
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <>
      {/* Botão Sandwich - Visível apenas em telas pequenas */}
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

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 z-40 h-screen bg-white border-r border-gray-200 shadow-md transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-64`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          <h1 className="text-lg font-semibold text-gray-800 mb-6">Dashboard</h1>
          <ul className="space-y-4">
            <li>
              <NavLink
                to="/dashboard/produtos"
                className={({ isActive }) =>
                  `flex items-center space-x-2 p-2 text-gray-700 hover:bg-gray-100 w-full text-left ${
                    isActive ? "font-bold text-redDark" : ""
                  }`
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  className="h-5 w-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 004.25 22.5h15.5a1.875 1.875 0 001.865-2.071l-1.263-12a1.875 1.875 0 00-1.865-1.679H16.5V6a4.5 4.5 0 10-9 0zM12 3a3 3 0 00-3 3v.75h6V6a3 3 0 00-3-3zm-3 8.25a3 3 0 106 0v-.75a.75.75 0 011.5 0v.75a4.5 4.5 0 11-9 0v-.75a.75.75 0 011.5 0v.75z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span>Produtos</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/historico"
                className={({ isActive }) =>
                  `flex items-center p-2 text-gray-700 hover:bg-gray-100 ${
                    isActive ? "font-bold text-redDark" : ""
                  }`
                }
              >
                <FaMoneyBill className="mr-2"/>
                <span>Todos os Lances</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}

export default SideBar;
