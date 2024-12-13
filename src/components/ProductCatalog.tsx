import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";
import { fetchProducts } from "../services/api";

interface Product {
  id: number;
  attributes: {
    lot_number: string;
    donor_name: string;
    donor_phone: string;
    minimum_value: number;
    bidder_name: string;
    bidder_phone: string;
    winning_value: number;
    description: string;
  };
}

function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts(currentPage);
        if (data.data && data.data.length > 0) {
          setProducts(data.data);
          setTotalPages(data.meta.total_pages);
        } else {
          setError("Nenhum produto disponível.");
        }
      } catch (err) {
        console.log(err);
        setError("Erro ao carregar produtos.");
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, [currentPage]);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Catálogo de Produtos</h1>
      <ul className="grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-6 w-full">
        {products.map((product) => (
          <li
            key={product.id}
            className="flex flex-col items-center"
          >
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}

export default ProductCatalog;
