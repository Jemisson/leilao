import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProducts, deleteProduct } from "../services/api";
import Pagination from "../components/Pagination";
import Button from "../components/Button";
import { Product } from "../types";
import ConfirmationModal from "../components/ConfirmationModal";

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedProductLot, setSelectedProductLot] = useState<string | null>(null);


  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts(currentPage);
        setProducts(data.data);
        setTotalPages(data.meta.total_pages);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar produtos.");
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, [currentPage]);

  const handleDeleteConfirmation = (productId: number, productLot: string) => {
    setSelectedProductId(productId);
    setSelectedProductLot(productLot);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedProductId !== null) {
      try {
        await deleteProduct(selectedProductId);
        setProducts(products.filter((product) => product.id !== selectedProductId));
        setIsModalOpen(false);
      } catch (err) {
        console.error("Erro ao deletar produto:", err);
      }
    }
  };

  const handleAddProduct = () => {
    navigate("/dashboard/produtos/new");
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciamento de Produtos</h1>
        {/* Usando o Componente Button */}
        <Button text="Adicionar Produto" onClick={handleAddProduct} />
      </div>
      <table className="min-w-full bg-white border border-gray-300 shadow-sm rounded-lg">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Imagem</th> 
            <th className="py-2 px-4 border-b">Lote</th>
            <th className="py-2 px-4 border-b">Nome</th>
            <th className="py-2 px-4 border-b">Descrição</th>
            <th className="py-2 px-4 border-b">Valor</th>
            <th className="py-2 px-4 border-b">Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="py-2 px-4 border-b">{product.id}</td>
              <td className="py-2 px-4 border-b">
              {product.attributes.image_urls?.[0] ? (
                <img
                  src={product.attributes.image_urls[0]}
                  alt={`Lote ${product.attributes.lot_number}`}
                  className="h-12 w-12 object-cover rounded-lg"
                />
              ) : (
                <span className="text-gray-400 italic">Sem Imagem</span>
              )}
            </td>
              <td className="py-2 px-4 border-b">{product.attributes.lot_number}</td>
              <td className="py-2 px-4 border-b">
                {product.attributes.description}
              </td>
              <td className="py-2 px-4 border-b">
                R$ {product.attributes.minimum_value}
              </td>
              <td className="py-2 px-4 border-b flex space-x-2">

              {/* Botão para ver detalhes */}
              <button
                onClick={() => navigate(`/dashboard/produtos/${product.id}/lances`)}
                className="text-blue-500 hover:text-blue-700"
                aria-label="Ver detalhes"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>

              </button>

              {/* Botão para excluir */}
              <button
                  onClick={() => handleDeleteConfirmation(product.id, product.attributes.lot_number)}
                  className="text-red-500 hover:text-red-700"
                  aria-label="Excluir"
                >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>

              </button>
            </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

      <ConfirmationModal
        isOpen={isModalOpen}
        title="Confirmar Exclusão"
        message={`Tem certeza de que deseja excluir o Lote ${selectedProductLot}?`}
        onConfirm={handleDelete}
        onCancel={() => setIsModalOpen(false)}
      />

    </div>
  );
};

export default ProductManagement;
