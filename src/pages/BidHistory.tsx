import React, { useEffect, useState } from "react";
import BidTable from "../components/BidTable";
import PageHeader from "../components/PageHeader";
import Pagination from "../components/Pagination";
import { fetchBids } from "../services/api";
import { Bid } from "../types";
import { toast } from "react-toastify";
import { FaMoneyBill } from "react-icons/fa";

const BidHistory: React.FC = () => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
    <div className="p-6 bg-gray-100">
      <PageHeader title="Histórico de Lances" icon={<FaMoneyBill className="h-5 w-5" />} />
      
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
