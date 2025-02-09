import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchUserById } from "../services/api";
import { User } from "../types";

const UserDetails: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchUserById(Number(userId));
        setUser(response.data);
      } catch (err) {
        console.error("Erro ao carregar detalhes do usuário:", err);
        setError("Erro ao carregar os detalhes do usuário. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    getUserDetails();
  }, [userId]);

  if (loading) return <p className="p-6">Carregando...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Detalhes do Usuário</h1>

      {user ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Nome:</strong> {user.attributes.name}</p>
          <p><strong>Email:</strong> {user.attributes.user_attributes.email}</p>
          <p><strong>Telefone:</strong> {user.attributes.phone}</p>
          <p><strong>CPF:</strong> {user.attributes.cpf}</p>
          <p><strong>Data de Nascimento:</strong> {user.attributes.birth}</p>
          <p><strong>Endereço: </strong> 
            {`${user.attributes.street}, ${user.attributes.number}, 
              ${user.attributes.neighborhood}, ${user.attributes.city} - 
              ${user.attributes.state}`}
          </p>

          <button 
            onClick={() => navigate("/dashboard/licitantes")} 
            className="mt-4 px-4 py-2 bg-redDark text-white rounded hover:bg-red-700"
          >
            Voltar para lista de usuários
          </button>
        </div>
      ) : (
        <p>Usuário não encontrado.</p>
      )}
    </div>
  );
};

export default UserDetails;
