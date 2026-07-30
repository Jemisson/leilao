import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { fetchProductById } from "../services/api";
import { Product } from "../types";
import { CiShare2 } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { formatCurrency } from "../utils/currency";
import { toast } from "react-toastify";
import { getAuthenticatedUser } from "../utils/authHelpers";
import BidModal from "./BidModal";
import { buildShareProductUrl } from "../config/backend";
import { useCatalogSettings } from "../hooks/useCatalogSettings";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const user = getAuthenticatedUser();
  const navigate = useNavigate();
  const [isBidModalOpen, setBidModalOpen] = useState(false);
  const isAdmin = user?.role === "admin";
  const { showProductValues } = useCatalogSettings();

  const getYouTubeEmbedUrl = (url: string): string | null => {
    const match = url.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/
    );
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const handleOpenBidModal = () => {
    if (!user?.profile_id) {
      navigate("/login");
      toast.error("Você precisa estar autenticado para dar lances.");
      return;
    }
    setBidModalOpen(true);
  };

  const getProduct = useCallback(async () => {
    try {
      const data = await fetchProductById(Number(id));
      setProduct(data.data);
    } catch (err) {
      toast.error(`Erro ao buscar produto: ${err}`);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    getProduct();
  }, [getProduct]);

  if (loading) return <p className="text-center mt-10">Carregando produto...</p>;
  if (!product) return <p className="text-center mt-10">Produto não encontrado ou já arrematado.</p>;

  const handleShare = () => {
    const url = buildShareProductUrl(product.id);
    const text = `Confira este produto: LOTE ${product.attributes.lot_number}`;

    if (navigator.share) {
      navigator.share({ title: "23° Leilão Direito de Viver", text, url });
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Link copiado!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full md:max-w-[720px] mx-auto">

        <div className="relative w-full">
          {product.attributes?.link_video ? (
            <iframe
              className="w-full max-h-[60vh] aspect-video rounded-t-lg"
              src={getYouTubeEmbedUrl(product.attributes.link_video) || ""}
              title="Vídeo do produto"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <img
              src={product.attributes?.images?.[0]?.url || "/empty.png"}
              alt="Imagem do produto"
              className="w-full max-h-[60vh] object-contain rounded-t-lg"
            />
          )}
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                LOTE: {product.attributes?.lot_number}
              </h3>
              {product.attributes.featured && (
                <span className="inline-flex items-center gap-1 rounded-md bg-pinkDark/10 px-2 py-1 text-xs font-bold text-pinkDark">
                  <FaStar className="h-3 w-3" />
                  Destaque
                </span>
              )}
            </div>
            <CiShare2
              title="Compartilhar"
              className="w-6 h-6 text-gray-500 hover:text-redDark cursor-pointer"
              onClick={handleShare}
            />
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {product.attributes?.description}
          </p>
          {showProductValues && product.attributes?.current_value !== undefined && (
            <p className="text-lg font-semibold text-red-600 dark:text-red-400">
              Valor: {formatCurrency(Number(product.attributes.current_value))}
            </p>
          )}

          {isAdmin && (
            <button
              type="button"
              onClick={handleOpenBidModal}
              className="inline-flex items-center px-3 py-2 mt-5 text-sm font-medium text-center text-white !bg-redDark rounded-lg hover:bg-redBright focus:ring-4 focus:outline-none focus:ring-redBright dark:bg-redBright"
            >
              Fazer um Lance
            </button>
          )}
        </div>
      </div>

      <BidModal
        isOpen={isBidModalOpen}
        onClose={() => setBidModalOpen(false)}
        productName={product.attributes.lot_number || ""}
        productId={product.id}
        profileUserId={user?.profile_id || 0}
        currentValue={Number(product.attributes.current_value || 0)}
        showCurrentValue={showProductValues}
        onSuccess={getProduct}
      />

    </div>
  );
};

export default ProductPage;
