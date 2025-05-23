import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { FaEye } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../components/Button";
import IconButton from "../components/IconButton";
import Pagination from "../components/Pagination";
import { fetchUsers } from "../services/api";
import { User, UsersResponse } from "../types";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response: UsersResponse = await fetchUsers(currentPage);

        setUsers(response.data || []);
        setTotalPages(response.meta?.total_pages || 1);
      } catch (err) {
        toast.error(`Erro ao carregar usuários: ${err}`);
        setError("Erro ao carregar os usuários.");
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, [currentPage]);

  const handleAddUser = () => {
    navigate("/participantes/new");
  };

  if (loading) return <p className="p-6">Carregando...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Lista de Usuários</h1>
          <div className="flex items-center mt-2">
            <MdAdminPanelSettings className="text-redDark" />
            <span className="text-sm text-gray-600 pl-2">Administrador do sistema</span>
          </div>
        </div>
        <Button text="Adicionar Usuário" onClick={handleAddUser} />
      </div>

      {users.length > 0 ? (
        <>
          <table className="min-w-full bg-white border border-gray-300 shadow-sm rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Nome</th>
                <th className="py-2 px-4 border-b">Telefone</th>
                <th className="py-2 px-4 border-b">Endereço</th>
                <th className="py-2 px-4 border-b">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="py-2 px-4 border-b text-center">{user.id}</td>
                  <td className="py-2 px-4 border-b text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <span>{user.attributes.name}</span>
                      {user.attributes.user_attributes.role === "admin" && <MdAdminPanelSettings className="text-redDark" />}
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b text-center">{user.attributes.phone}</td>
                  <td className="py-2 px-4 border-b text-center">
                    {`${user.attributes.street}, ${user.attributes.number}, 
                      ${user.attributes.neighborhood}, ${user.attributes.city}`}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <IconButton
                      onClick={() => navigate(`/dashboard/participantes/${user.attributes.id}`)}
                      icon={<FaEye className="size-6" />}
                      ariaLabel="Ver detalhes"
                      className="text-blue-500 hover:text-blue-700"
                    />

                    <IconButton
                      onClick={() => navigate(`/dashboard/participantes/${user.attributes.id}/edit`)}
                      icon={<CiEdit className="size-6" />}
                      ariaLabel="Editar"
                      className="text-yellow-500 hover:text-yellow-700"
                    />
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      ) : (
        <p className="text-gray-700 italic">Nenhum usuário cadastrado.</p>
      )}
    </div>
  );
};

export default UserManagement;
