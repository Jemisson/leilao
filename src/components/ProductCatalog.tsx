import { useEffect, useState } from "react";
import { fetchProducts } from "../services/api";
import { Product, ProductCatalogProps } from "../types";
import Pagination from "./Pagination";
import ProductCard from "./ProductCard";
import NoData from "./NoData";
import BidModal from "./BidModal";

function ProductCatalog({ selectedCategory, profileUserId }: ProductCatalogProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryChanged, setCategoryChanged] = useState(false);
  const [isBidModalOpen, setBidModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    setCategoryChanged(true);
    setCurrentPage(1);
  }, [selectedCategory]);

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchProducts(currentPage, selectedCategory);

        if (data.data && data.data.length > 0) {
          setProducts(data.data);
          setTotalPages(data.meta.total_pages);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar produtos.");
      } finally {
        setLoading(false);
        setCategoryChanged(false);
      }
    };

    if (!categoryChanged) {
      getProducts();
    }
  }, [currentPage, selectedCategory, categoryChanged]);

  const handleOpenBidModal = (product: Product) => {
    setSelectedProduct(product);
    setBidModalOpen(true);
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
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
