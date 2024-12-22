import { useState } from "react";
import SideBar from "../components/SideBar";

function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Controle do estado do Sidebar

  return (
    <div className="flex">
      <SideBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        } p-6 bg-gray-100 min-h-screen pt-20`}
      >
        <h1 className="text-2xl font-bold">Bem-vindo ao Dashboard</h1>
        <p className="mt-4">Aqui está o conteúdo do seu dashboard.</p>
      </div>
    </div>
  );
}

export default DashboardPage;
