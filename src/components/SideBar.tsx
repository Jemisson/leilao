import { useEffect } from "react";
import { BsPersonLinesFill } from "react-icons/bs";
import { FaBars, FaTimes } from "react-icons/fa";
import { IoBagHandle } from "react-icons/io5";
import { MdDashboard, MdLock, MdSettings } from "react-icons/md";
import { SideBarProps } from "../types";
import MenuItem from "./MenuItem";

function SideBar({ isSidebarOpen, setIsSidebarOpen }: SideBarProps) {

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsSidebarOpen]);
  

  const handleMenuClick = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const sidebarContent = (
    <div className="flex h-full flex-col overflow-y-auto p-4">
      <div className="mb-4 border-b border-gray-100 pb-4">
        <p className="text-xs font-bold uppercase text-gray-400">Administração</p>
        <h2 className="mt-1 text-lg font-bold text-gray-900">Dashboard</h2>
      </div>

      <ul className="space-y-1.5">
        <MenuItem
          to="/dashboard"
          icon={<MdDashboard />}
          label="Dashboard"
          onClick={handleMenuClick}
        />
        <MenuItem
          to="/dashboard/produtos"
          icon={<IoBagHandle />}
          label="Produtos"
          onClick={handleMenuClick}
        />
        <MenuItem
          to="/dashboard/participantes"
          icon={<BsPersonLinesFill />}
          label="Participantes"
          onClick={handleMenuClick}
        />
        <MenuItem
          to="/dashboard/configuracoes/catalogo"
          icon={<MdSettings />}
          label="Catálogo"
          onClick={handleMenuClick}
        />
        <MenuItem
          to="/dashboard/alterar-senha"
          icon={<MdLock />}
          label="Alterar Senha"
          onClick={handleMenuClick}
        />
      </ul>

      <div className="mt-6 rounded-md border border-blueBright/20 bg-blueBright/5 p-3">
        <p className="text-xs font-semibold uppercase text-blueBright">Leilão Direito de Viver</p>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed left-4 top-24 z-50 inline-flex h-11 w-11 items-center justify-center rounded-md bg-pinkDark text-white shadow-lg transition hover:bg-redDark focus:outline-none focus:ring-2 focus:ring-white md:hidden"
        aria-label={isSidebarOpen ? "Fechar menu do dashboard" : "Abrir menu do dashboard"}
        aria-expanded={isSidebarOpen}
      >
        {isSidebarOpen ? <FaTimes className="h-5 w-5" /> : <FaBars className="h-5 w-5" />}
      </button>

      {isSidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          aria-label="Fechar menu do dashboard"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-20 z-40 h-[calc(100vh-5rem)] w-72 bg-white shadow-xl transition-transform duration-300 md:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Menu do dashboard"
      >
        {sidebarContent}
      </aside>

      <aside
        className="hidden w-64 shrink-0 rounded-lg border border-gray-200 bg-white shadow-sm md:block"
        aria-label="Menu do dashboard"
      >
        {sidebarContent}
      </aside>
    </>
  );
}

export default SideBar;
