import React, { useEffect, useState } from "react";
import { parseISO, format } from "date-fns";
import { fetchBids, fetchBidsById } from "../services/api";
import { Bid, BidTableProps } from "../types";
import Pagination from "./Pagination";
import { useWebSocket } from "../hooks/useWebSocket";

const BidTable: React.FC<BidTableProps> = ({ showLotNumber = false, productId }) => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { cable } = useWebSocket();

  useEffect(() => {
    const fetchAllBids = async (page: number) => {
      setLoading(true);
      setError(null);

      try {
        let response;
        if (productId) {
          response = await fetchBidsById(productId, page);
        } else {
          response = await fetchBids(page);
        }

        setBids(response.data || []);
        setTotalPages(response.meta?.total_pages || 1);
      } catch (err) {
        console.error("Erro ao carregar lances:", err);
        setError("Erro ao carregar lances. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllBids(currentPage);
  }, [currentPage, productId]);

  useEffect(() => {
    if (!cable) return;

    const subscription = cable.subscriptions.create("BidsChannel", {
      received(data: {data: Bid}) {
        setBids((prevBids) => [data.data, ...prevBids]);
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [cable]);

  const formatDate = (isoDate: string): string => {
    const parsedDate = parseISO(isoDate);
    return format(parsedDate, "dd/MM/yyyy - HH:mm");
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {bids.length > 0 ? (
        <>
          <table className="min-w-full bg-white border border-gray-300 shadow-sm rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">ID</th>
                {showLotNumber && <th className="py-2 px-4 border-b">Número do Lote</th>}
                <th className="py-2 px-4 border-b">Data</th>
                <th className="py-2 px-4 border-b">Nome do Licitante</th>
                <th className="py-2 px-4 border-b">Telefone</th>
                <th className="py-2 px-4 border-b">Valor do Lance</th>
              </tr>
            </thead>
            <tbody>
              {bids.map((bid) => (
                <tr key={bid.id}>
                  <td className="py-2 px-4 border-b text-center">{bid.attributes.id}</td>
                  {showLotNumber && (
                    <td className="py-2 px-4 border-b text-center">{bid.attributes.lot_number}</td>
                  )}
                  <td className="py-2 px-4 border-b text-center">
                    {formatDate(bid.attributes.created_at)}
                  </td>
                  <td className="py-2 px-4 border-b text-center">{bid.attributes.name}</td>
                  <td className="py-2 px-4 border-b text-center">{bid.attributes.phone}</td>
                  <td className="py-2 px-4 border-b text-center">R$ {Number(bid.attributes.value).toFixed(2)}</td>
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
        <p className="text-gray-700 italic">Nenhum lance registrado.</p>
      )}
    </div>
  );
};

export default BidTable;
