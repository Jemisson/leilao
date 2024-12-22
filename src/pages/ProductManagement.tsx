import React, { useEffect, useState } from "react";
import { fetchProducts, deleteProduct } from "../services/api";
import { Product } from "../types"; // Importa a interface do arquivo types.ts

const ProductManagementPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        const data = await fetchProducts(currentPage);
        setProducts(data.data); // Supondo que o formato do response seja compatível com a interface Product
        setTotalPages(data.meta.total_pages); // Total de páginas retornado no meta
      } catch (err) {
        console.error("Erro ao carregar produtos:", err);
        setError("Não foi possível carregar os produtos.");
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, [currentPage]);

  const handleDelete = async (productId: number) => {
    if (window.confirm("Tem certeza de que deseja excluir este produto?")) {
      try {
        await deleteProduct(productId);
        setProducts(products.filter((product) => product.id !== productId));
      } catch (err) {
        console.error("Erro ao excluir produto:", err);
        alert("Erro ao excluir produto. Tente novamente.");
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Gerenciamento de Produtos</h1>
      <table className="w-full border-collapse border border-gray-300 bg-white shadow-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-300 p-2 text-left">Nome</th>
            <th className="border border-gray-300 p-2 text-left">Descrição</th>
            <th className="border border-gray-300 p-2 text-left">Valor</th>
            <th className="border border-gray-300 p-2 text-left">Doador</th>
            <th className="border border-gray-300 p-2 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-100">
              <td className="border border-gray-300 p-2">{product.attributes.name}</td>
              <td className="border border-gray-300 p-2">{product.attributes.description}</td>
              <td className="border border-gray-300 p-2">R$ {product.attributes.winning_value}</td>
              <td className="border border-gray-300 p-2">{product.attributes.donor_name}</td>
              <td className="border border-gray-300 p-2">
                <button
                  className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                  onClick={() => handleDelete(product.id)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginação */}
      <div className="flex justify-between items-center mt-4">
        <button
          className={`px-4 py-2 text-white bg-gray-500 rounded ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-600"
          }`}
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Anterior
        </button>
        <span className="text-gray-700">
          Página {currentPage} de {totalPages}
        </span>
        <button
          className={`px-4 py-2 text-white bg-gray-500 rounded ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-600"
          }`}
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Próxima
        </button>
      </div>
    </div>
  );
};

export default ProductManagementPage;
