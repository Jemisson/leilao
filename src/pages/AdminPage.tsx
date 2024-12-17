import React from "react";
import { useAuth } from "../context/AuthContext";

const AdminPage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Área Administrativa</h1>
      <p className="mb-4">Bem-vindo, {user?.email}!</p>
      <button
        onClick={logout}
        className="bg-redBright text-white py-2 px-4 rounded hover:bg-redDark"
      >
        Sair
      </button>
    </div>
  );
};

export default AdminPage;
