import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductById, fetchBidsById } from "../services/api";
import { Product, Bid } from "../types";
import BidTable from "../components/BidTable";
import PageHeader from "../components/PageHeader";
import Pagination from "../components/Pagination";
import { toast } from "react-toastify";
import { useCatalogSettings } from "../hooks/useCatalogSettings";
import { FaStar } from "react-icons/fa";
import { ImHammer2 } from "react-icons/im";
import { formatCurrency } from "../utils/currency";

const ProductDetails: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const { showProductValues } = useCatalogSettings();

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

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <PageHeader
        title="Detalhes do Produto"
        icon={<ImHammer2 className="h-5 w-5" />}
        actions={
          <button
            type="button"
            onClick={() => navigate(`/dashboard/produtos/${product?.id}/edit`)}
            className="rounded-lg border border-yellow-700 px-4 py-2 font-bold text-yellow-600 transition hover:bg-yellow-50 hover:text-yellow-700"
            aria-label="Editar"
          >
            Editar produto
          </button>
        }
      />
  
      {/* Conteúdo principal: detalhes + histórico */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Detalhes do produto */}
        <div className="w-full md:w-1/3">
          {product && (
            <div className="mb-6">
              <div className="mb-2 flex flex-wrap items-center gap-3">
                <h1 className="text-5xl font-bold text-redBright">{product.attributes.lot_number}</h1>
                {product.attributes.featured && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-pinkDark/10 px-2 py-1 text-xs font-bold text-pinkDark">
                    <FaStar className="h-3 w-3" />
                    Destaque
                  </span>
                )}
              </div>
              <p className="text-gray-700">
                <strong>Descrição:</strong> {product.attributes.description}
              </p>
              {showProductValues && product.attributes.minimum_value !== undefined && (
                <p className="text-gray-700 mt-2">
                  <strong>Valor Inicial:</strong> R$ {Number(product.attributes.minimum_value).toFixed(2)}
                </p>
              )}
              {showProductValues && product.attributes.current_value !== undefined && (
                <p className="text-2xl mt-5 text-redBright">
                  <strong>Valor atual: R$ {Number(product.attributes.current_value).toFixed(2)} </strong>
                </p>
              )}
              {product.attributes.auctioned === 1 && (
                <div className="mt-5 rounded-lg border border-blueBright/20 bg-white p-4 shadow-sm">
                  <h2 className="mb-3 text-base font-bold text-gray-900">Dados do arremate</h2>
                  <div className="space-y-2 text-sm text-gray-700">
                    {(product.attributes.bidder_name || product.attributes.winning_name) && (
                      <p>
                        <strong>Comprador:</strong> {product.attributes.bidder_name || product.attributes.winning_name}
                      </p>
                    )}
                    {product.attributes.bidder_phone && (
                      <p>
                        <strong>Telefone:</strong> {product.attributes.bidder_phone}
                      </p>
                    )}
                    {(product.attributes.winning_value !== undefined || product.attributes.current_value !== undefined) && (
                      <p>
                        <strong>Valor de arremate:</strong>{" "}
                        {formatCurrency(Number(product.attributes.winning_value ?? product.attributes.current_value))}
                      </p>
                    )}
                    {product.attributes.sold_at && (
                      <p>
                        <strong>Data do arremate:</strong>{" "}
                        {new Intl.DateTimeFormat("pt-BR").format(new Date(product.attributes.sold_at))}
                      </p>
                    )}
                  </div>
                </div>
              )}
              <div className="flex gap-4 flex-wrap mt-6">
                {Array.isArray(product.attributes.images) && product.attributes.images?.map((image) => (
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
