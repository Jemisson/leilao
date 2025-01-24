import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProducts, deleteProduct } from "../services/api";
import Pagination from "../components/Pagination";
import Button from "../components/Button";
import { Product } from "../types";
import ConfirmationModal from "../components/ConfirmationModal";
import { CiEdit, CiTrash } from "react-icons/ci";
import { FaEye } from "react-icons/fa";

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
            <th className="py-2 px-4 border-b">Categoria</th>
            <th className="py-2 px-4 border-b">Nome</th>
            <th className="py-2 px-4 border-b">Valor</th>
            <th className="py-2 px-4 border-b">Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="py-2 px-4 border-b text-center">{product.id}</td>
              <td className="py-2 px-4 border-b  text-center">
              {product.attributes.images && product.attributes.images.length > 0 ? (
                <img
                  src={product.attributes.images[0].url}
                  alt={`Lote ${product.attributes.lot_number}`}
                  className="h-12 w-12 object-cover rounded-lg"
                />
              ) : (
                  <span className="text-gray-400 italic">Sem Imagem</span>
                )}
              </td>
              <td className="py-2 px-4 border-b  text-center">{product.attributes.lot_number}</td>
              <td className="py-2 px-4 border-b  text-center">{product.attributes.category_title}</td>
              <td className="py-2 px-4 border-b">
                {product.attributes.description}
              </td>
              <td className="py-2 px-4 border-b text-center">
                R$ {product.attributes.current_value}
              </td>
              <td className="py-2 px-4 border-b text-center">
                <button
                  onClick={() => navigate(`/dashboard/produtos/${product.id}/lances`)}
                  className="text-blue-500 hover:text-blue-700"
                  aria-label="Ver detalhes"
                >
                  <FaEye className="size-6"/>
                </button>

                <button
                  onClick={() => navigate(`/dashboard/produtos/${product.id}/edit`)}
                  className="text-yellow-500 hover:text-yellow-700"
                  aria-label="Editar"
                >
                  <CiEdit className="size-6"/>
                </button>

                <button
                  onClick={() => handleDeleteConfirmation(product.id, product.attributes.lot_number)}
                  className="text-red-500 hover:text-red-700"
                  aria-label="Excluir"
                >
                  <CiTrash className="size-6"/>
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
