import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { fetchProducts } from "../services/api";

interface Product {
  id: number,
  attributes: {
    lot_number: string,
    donor_name: string,
    donor_phone: string,
    minimum_value: number,
    bidder_name: string,
    bidder_phone: string,
    winning_value: number,
    description:string
  }
}

function ProductCatalog () {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts();
        if (data.data && data.data.length > 0) {
          setProducts(data.data);
        } else {
          setError('Nenhum produto disponível.');
        }
      } catch (err) {
        console.log(err);
        
        setError('Erro ao carregar produtos.');
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Catálogo de Produtos</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
    </ul>
  </div>
  );
};

export default ProductCatalog;
