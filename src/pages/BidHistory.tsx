import React, { useEffect, useState } from "react";
import BidTable from "../components/BidTable";
import Pagination from "../components/Pagination";
import { fetchBids } from "../services/api";
import { Bid } from "../types";
import { useWebSocket } from "../hooks/useWebSocket";
import { toast } from "react-toastify";

const BidHistory: React.FC = () => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { cable } = useWebSocket();
  const [isWebSocketReady, setIsWebSocketReady] = useState(false);

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

  useEffect(() => {
    if (cable) {
      setIsWebSocketReady(true);
    }
  }, [cable]); 

  useEffect(() => {
    if (!isWebSocketReady || !cable) return;


    const subscription = cable.subscriptions.create("BidsChannel", {
      received(data: { data: Bid }) {
        setBids((prevBids) => {
          if (currentPage === 1) {
            return [data.data, ...prevBids];
          }
          return prevBids;
        });
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isWebSocketReady, cable, currentPage]);

  if (loading) return <p className="p-6">Carregando...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Histórico de Lances</h1>
      
      <BidTable showLotNumber={true} bids={bids} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default BidHistory;
