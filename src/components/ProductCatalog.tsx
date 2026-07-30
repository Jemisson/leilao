import { useCallback, useEffect, useState } from "react";
import { fetchProducts, searchProducts } from "../services/api";
import { Product, ProductCatalogProps } from "../types";
import Pagination from "./Pagination";
import ProductCard from "./ProductCard";
import NoData from "./NoData";
import { toast } from "react-toastify";
import ProductDetailsModal from "./ProductDetailsModal";
import VideoModal from "./VideoModal";
import ProductSearch from "./ProductSearch";
import { FaTags } from "react-icons/fa";
import { useCatalogSettings } from "../hooks/useCatalogSettings";
import PageHeader from "./PageHeader";

function ProductCatalog({ selectedCategory }: ProductCatalogProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProductModal, setSelectedProductModal] = useState<Product | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const { showProductValues, loading: catalogSettingsLoading } = useCatalogSettings();

  const handleOpenDetails = (product: Product) => {
    if (product.attributes.link_video) {
      setSelectedProduct(product);
      setIsVideoModalOpen(true);
    } else {
      setSelectedProductModal(product);
      setIsProductModalOpen(true);
    }
  };

  const handleCloseDetails = () => {
    setIsProductModalOpen(false);
    setSelectedProductModal(null);
  };

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery(null);
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const getProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = searchQuery
        ? await searchProducts(searchQuery, 0, currentPage, {
            categoryId: selectedCategory,
          })
        : await fetchProducts(currentPage, selectedCategory, 0);

      if (Array.isArray(data.data) && data.data.length > 0) {
        setProducts(data.data);
        setTotalPages(data.meta.total_pages);
      } else {
        setProducts([]);
        setTotalPages(1);
      }
    } catch (err) {
      setError("Erro ao carregar produtos.");
      toast.error(`Erro ao carregar produtos: ${err}`);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedCategory, searchQuery]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  return (
    <main className="min-h-screen bg-[#f4f7fb]">
      <section className="h-3 border-b-4 border-pinkDark bg-blueBright" aria-hidden="true" />

      <section className="mx-auto w-[90%] py-8">
        <PageHeader
          title="Catálogo de produtos"
          icon={<FaTags className="h-5 w-5" />}
          actions={
            <ProductSearch
              onSearch={handleSearch}
              onClear={handleClearSearch}
              defaultValue={searchQuery || ''}
            />
          }
        />

        {error ? (
          <p className="rounded-lg border border-red-200 bg-white p-4 font-semibold text-red-700">
            {error}
          </p>
        ) : loading ? (
          <p className="rounded-lg border border-gray-200 bg-white p-4 font-semibold text-gray-700 shadow-sm">
            Carregando produtos...
          </p>
        ) : products.length === 0 ? (
          <NoData />
        ) : (
          <>
            <div className="mb-6 flex justify-center sm:justify-end">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>

            <ul className="grid w-full grid-cols-[repeat(auto-fill,_minmax(min(100%,_260px),_320px))] justify-center gap-5 sm:justify-start lg:gap-6">
              {products.map((product) => (
                <li
                  key={product.id}
                  className="flex h-full"
                >
                  <ProductCard
                    product={product}
                    onViewDetails={() => handleOpenDetails(product)}
                    showProductValues={showProductValues}
                  />
                </li>
              ))}
            </ul>

            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </>
        )}

      <ProductDetailsModal
        isOpen={isProductModalOpen}
        onClose={handleCloseDetails}
        imageUrl={
          selectedProductModal?.attributes.images &&
          selectedProductModal?.attributes.images.length > 0
            ? selectedProductModal.attributes.images[0].url
            : "/empty.png"
        }
        description={selectedProductModal?.attributes.description || ""}
        value={selectedProductModal?.attributes.current_value || ""}
        lotNumber={selectedProductModal?.attributes.lot_number}
        showProductValue={showProductValues && !catalogSettingsLoading}
        featured={Boolean(selectedProductModal?.attributes.featured)}
      />

      {selectedProduct?.attributes.link_video && (
        <VideoModal
          isOpen={isVideoModalOpen}
          videoUrl={selectedProduct.attributes.link_video}
          onClose={() => setIsVideoModalOpen(false)}
          lotNumber={selectedProduct.attributes.lot_number}
          description={selectedProduct.attributes.description || ""}
          value={selectedProduct?.attributes.current_value || ""}
          showProductValue={showProductValues && !catalogSettingsLoading}
          featured={Boolean(selectedProduct.attributes.featured)}
        />
      )}

      </section>
    </main>
  );
}

export default ProductCatalog;
