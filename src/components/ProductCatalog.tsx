import { useEffect, useState } from "react";
import { fetchProducts } from "../services/api";
import { Product } from "../types";
import Pagination from "./Pagination";
import ProductCard from "./ProductCard";
import NoData from "./NoData";

interface ProductCatalogProps {
  selectedCategory: string | null;
}

function ProductCatalog({ selectedCategory }: ProductCatalogProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryChanged, setCategoryChanged] = useState(false);

  useEffect(() => {
    setCategoryChanged(true);
    setCurrentPage(1);
  }, [selectedCategory]);

  // Buscar produtos
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

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 mt-28">Catálogo de Produtos</h1>

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
              <li key={product.id} className="flex flex-col items-center">
                <ProductCard product={product} />
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
    </div>
  );
}

export default ProductCatalog;
