import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchUserById, fetchUserBids, fetchBids } from "../services/api";
import { User, Bid } from "../types";
import { toast } from "react-toastify";
import BidTable from "../components/BidTable";
import Pagination from "../components/Pagination";

const UserDetails: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const getUserDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchUserById(Number(userId));
        setUser(response.data);
      } catch (err) {
        setError("Erro ao carregar os detalhes do usuário. Tente novamente.");
        toast.error(`Erro ao carregar detalhes do usuário: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    const getUserBids = async () => {
      try {
        const response = await fetchUserBids(Number(userId));

        setBids(response.data);
      } catch (err) {
        toast.error(`Erro ao carregar lances do usuário: ${err}`);
      }
    };

    getUserDetails();
    getUserBids();
  }, [userId]);

    useEffect(() => {
      const getBids = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetchBids(currentPage);
          setBids(response.data || []);
          setTotalPages(response.meta?.total_pages || 1);
        } catch (err) {
          setError("Erro ao carregar o histórico de lances.");
          toast.error(`Erro ao carregar lances: ${err}`);
        } finally {
          setLoading(false);
        }
      };
  
      getBids();
    }, [currentPage]);

  if (loading) return <p className="p-6">Carregando...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Detalhes do Usuário</h1>

      {user ? (
        <div className="grid grid-cols-2 gap-6">
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

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Lances realizados</h2>
            {bids && bids.length > 0 ? (
              <>
                <BidTable
                  bids={bids}
                  showLotNumber={true}
                  showName={false}
                  showPhone={false}
                />

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </>
            ) : (
              <p className="text-gray-500">Este usuário ainda não fez lances.</p>
            )}
          </div>
        </div>
      ) : (
        <p>Usuário não encontrado.</p>
      )}
    </div>
  );
};

export default UserDetails;
