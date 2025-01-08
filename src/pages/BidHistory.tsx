import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProductById, fetchBids } from "../services/api";
import { Product, Bid } from "../types";
import { parseISO, format } from "date-fns";

const BidHistory: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const productData = await fetchProductById(Number(productId));
        setProduct(productData.data);

        const bidData = await fetchBids(Number(productId));
        console.log(bidData.data);
        
        setBids(bidData.data);
      } catch (err) {
        console.error("Erro ao carregar detalhes do produto ou lances:", err);
        setError("Erro ao carregar dados. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const formatDate = (isoDate: string): string => {
    const parsedDate = parseISO(isoDate);
    return format(parsedDate, "dd/MM/yyyy ' - ' HH:mm");
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1>Histórico de lances</h1>
      {product && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">{product.attributes.lot_number}</h1>
          <p className="text-gray-700">
            <strong>Descrição:</strong> {product.attributes.description}
          </p>
          <p className="text-gray-700">
            <strong>Valor Mínimo:</strong> R$ {product.attributes.minimum_value}
          </p>
        </div>
      )}

      <h2 className="text-xl font-bold mb-4">Histórico de Lances</h2>
      {bids.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-300 shadow-sm rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Data</th>
              <th className="py-2 px-4 border-b">Nome do Licitante</th>
              <th className="py-2 px-4 border-b">Telefone</th>
              <th className="py-2 px-4 border-b">Valor do Lance</th>
            </tr>
          </thead>
          <tbody>
            {bids.map((bid) => (
              <tr key={bid.id}>
                <td className="py-2 px-4 border-b">{bid.attributes.id}</td>
                <td className="py-2 px-4 border-b">
                  {formatDate(bid.attributes.created_at)}
                </td>
                <td className="py-2 px-4 border-b">{bid.attributes.name}</td>
                <td className="py-2 px-4 border-b">{bid.attributes.phone}</td>
                <td className="py-2 px-4 border-b">R$ {bid.attributes.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-700 italic">Nenhum lance registrado para este produto.</p>
      )}
    </div>
  );
};

export default BidHistory;
