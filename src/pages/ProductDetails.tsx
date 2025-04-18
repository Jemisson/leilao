import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductById, fetchBidsById } from "../services/api";
import { Product, Bid } from "../types";
import BidTable from "../components/BidTable";
import Pagination from "../components/Pagination";
import { useWebSocket } from "../hooks/useWebSocket";
import { toast } from "react-toastify";

const ProductDetails: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { cable } = useWebSocket();
  const [isWebSocketReady, setIsWebSocketReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const productData = await fetchProductById(Number(productId));
        setProduct(productData.data);
      } catch (err) {
        setError("Erro ao carregar os detalhes do produto. Tente novamente.");
        toast.error(`Erro ao carregar detalhes do produto: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);


  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response = await fetchBidsById(Number(productId), currentPage);
        setBids(response.data || []);
        setTotalPages(response.meta?.total_pages || 1);
      } catch (err) {
        setError("Erro ao carregar os lances.");
        toast.error(`Erro ao carregar lances: ${err}`);
      }
    };

    fetchBids();
  }, [productId, currentPage]);

  useEffect(() => {
    if (cable) {
      setIsWebSocketReady(true);
    }
  }, [cable]);

  useEffect(() => {
    if (!isWebSocketReady || !cable) return;

    const subscription = cable.subscriptions.create("BidsChannel", {
      received(data: { data: Bid }) {
        if (Number(data.data.attributes.product) === Number(productId)) {
          setBids((prevBids) => [data.data, ...prevBids]);
          setProduct((prevProduct) =>
            prevProduct
              ? {
                  ...prevProduct,
                  attributes: {
                    ...prevProduct.attributes,
                    current_value: Number(data.data.attributes.value),
                  },
                }
              : prevProduct
          );
        }
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isWebSocketReady, cable, productId]);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Título e botão de editar */}
      <div className="flex justify-between items-center mb-6 w-full">
        <h1 className="font-bold text-5xl">Lote</h1>
        <a
          onClick={() => navigate(`/dashboard/produtos/${product?.id}/edit`)}
          className="font-bold flex justify-center items-center text-yellow-500 hover:text-yellow-700 border border-yellow-700 rounded py-2 px-4 cursor-pointer"
          aria-label="Editar"
        >
          Editar produto
        </a>
      </div>
  
      {/* Conteúdo principal: detalhes + histórico */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Detalhes do produto */}
        <div className="w-full md:w-1/3">
          {product && (
            <div className="mb-6">
              <h1 className="text-5xl font-bold mb-2 text-redBright">{product.attributes.lot_number}</h1>
              <p className="text-gray-700">
                <strong>Descrição:</strong> {product.attributes.description}
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Valor Inicial:</strong> R$ {product.attributes.minimum_value}
              </p>
              <p className="text-2xl mt-5 text-redBright">
                <strong>Valor atual: R$ {Number(product.attributes.current_value).toFixed(2)} </strong>
              </p>
              <div className="flex gap-4 flex-wrap mt-6">
                {product.attributes.images?.map((image) => (
                  <img
                    key={image.id}
                    src={image.url}
                    alt={`Imagem ${image.id}`}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
  
        {/* Histórico de lances */}
        <div className="w-full md:w-2/3">
          <h2 className="text-xl font-bold mb-4">Histórico de Lances</h2>
          <BidTable showLotNumber={false} bids={bids} />
  
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
  
  
};

export default ProductDetails;
