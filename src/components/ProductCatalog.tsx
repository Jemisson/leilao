import { useEffect, useState } from "react";
import { fetchProducts } from "../services/api";
import { Bid, Product, ProductCatalogProps } from "../types";
import Pagination from "./Pagination";
import ProductCard from "./ProductCard";
import NoData from "./NoData";
import BidModal from "./BidModal";
import { useWebSocket } from "../hooks/useWebSocket";
import { useNavigate } from "react-router-dom";
import { getAuthenticatedUser } from "../utils/authHelpers";
import { toast } from "react-toastify";

function ProductCatalog({ selectedCategory, profileUserId }: ProductCatalogProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [updatedProducts, setUpdatedProducts] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isBidModalOpen, setBidModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { cable } = useWebSocket();
  const navigate = useNavigate();
  const user = getAuthenticatedUser();

  const handleOpenBidModal = (product: Product) => {
    if (!profileUserId) {
      navigate("/login");
      return;
    }
    setSelectedProduct(product);
    setBidModalOpen(true);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchProducts(currentPage, selectedCategory, 0);

        if (data.data && data.data.length > 0) {
          setProducts(data.data);
          setTotalPages(data.meta.total_pages);
        } else {
          setProducts([]);
        }
      } catch (err) {
        setError("Erro ao carregar produtos.");
        toast.error(`Erro ao carregar produtos: ${err}`);
      } finally {
        setLoading(false);
      }
    };

      getProducts();
  }, [currentPage, selectedCategory]);

  useEffect(() => {
    if (!cable) return;

    const subscription = cable.subscriptions.create("BidsChannel", {
      received(data: {data: Bid}) {

        setProducts((prevProducts) => {
          return prevProducts.map((product) => {
            if (Number(product.id) === Number(data.data.attributes.product)) {
              setUpdatedProducts((prev) => new Set(prev).add(product.id));

              setTimeout(() => {
                setUpdatedProducts((prev) => {
                  const newSet = new Set(prev);
                  newSet.delete(product.id);
                  return newSet;
                });
              }, 2000);

              return {
                ...product,
                attributes: {
                  ...product.attributes,
                  current_value: Number(data.data.attributes.value),
                },
              };
            } else {
              return product;
            }
          });
        });

      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [cable]);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <p className="font-bold text-xl text-redDark mb-2">Olá {user?.name}!</p>
      <h1 className="text-3xl font-bold mb-6">Catálogo de Produtos</h1>

      {products.length === 0 ? (
        <NoData />
      ) : (
        <>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />

          <ul className="grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-6 w-full mt-6">
            {products.map((product) => (
              <li 
                key={product.id}
                className="flex flex-col items-center"
              >
                <ProductCard
                  product={product}
                  isUpdated={updatedProducts.has(product.id)}
                  onBid={() => handleOpenBidModal(product)}
                  />
              </li>
            ))}
          </ul>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      )}

      <BidModal
        isOpen={isBidModalOpen}
        onClose={() => setBidModalOpen(false)}
        productName={selectedProduct?.attributes.lot_number || ''}
        productId={selectedProduct?.id || 0}
        profileUserId={profileUserId}
        currentValue={selectedProduct?.attributes.current_value || 0}
      />
    </div>
  );
}

export default ProductCatalog;
