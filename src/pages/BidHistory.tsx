import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductById, fetchBids } from "../services/api";
import { Product, Bid } from "../types";
import { parseISO, format } from "date-fns";
import NoData from "../components/NoData";

const BidHistory: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
    <div className="p-6 bg-gray-100 flex flex-wrap justify-between">
      <div className="flex justify-between w-full min-h-1">
        <h1 className="font-bold text-3xl">Lote</h1>
        <a
          onClick={() => navigate(`/dashboard/produtos/${product?.id}/edit`)}
          className="font-bold text-yellow-500 hover:text-yellow-700 border border-yellow-700 rounded py-2 px-4"
          aria-label="Editar"
        >
          Editar produto
        </a>
      </div>
      <div className="w-1/3">
        {product && (
          <div className="mb-6">
            <h1 className="text-5xl font-bold mb-2 text-redBright">{product.attributes.lot_number}</h1>
            <p className="text-gray-700">
              <strong>Descrição:</strong> {product.attributes.description}
            </p>
            <p className="text-gray-700">
              <strong>Valor Mínimo:</strong> R$ {product.attributes.minimum_value}
            </p>
            <div className="flex gap-10 justify-start flex-wrap mt-10">
              {product.attributes.images?.map((image) => (
                <img
                  key={image.id}
                  src={image.url}
                  alt={`Imagem ${image.id}`}
                  className="w-1/6 h-1/6 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="w-2/3 pl-10">
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
          <NoData className={"w-1/5"}/>
        )}
      </div>
    </div>
  );
};

export default BidHistory;
