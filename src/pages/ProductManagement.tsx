import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProducts, deleteProduct, soldProduct } from "../services/api";
import Pagination from "../components/Pagination";
import Button from "../components/Button";
import { Product } from "../types";
import ConfirmationModal from "../components/ConfirmationModal";
import { CiEdit, CiTrash } from "react-icons/ci";
import { FaEye } from "react-icons/fa";
import { ImHammer2 } from "react-icons/im";
import AuctionModal from "../components/AuctionModal";
import IconButton from "../components/IconButton";

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuctionModalOpen, setIsAuctionModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts(currentPage, null ,0);
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

  const handleDeleteConfirmation = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (selectedProduct) {
      try {
        await deleteProduct(selectedProduct.id);
        setProducts(products.filter((product) => product.id !== selectedProduct.id));
        setIsModalOpen(false);
      } catch (err) {
        console.error("Erro ao deletar produto:", err);
      }
    }
  };

  const handleMarkAsSoldConfirmation = (product: Product) => {
    setSelectedProduct(product);
    setIsAuctionModalOpen(true);
  };
  
  const handleMarkAsSold = async (productId: number) => {
    if (productId) {
      console.log(productId);
      try {
        await soldProduct(productId);
        setProducts(products.filter((product) => product.id !== productId));
        setIsAuctionModalOpen(false);
      } catch (err) {
        console.error("Erro ao arrematar produto:", err);
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
                R$ {Number(product.attributes.current_value).toFixed(2)}
              </td>
              <td className="py-2 px-4 border-b text-center">
                <IconButton
                  onClick={() => navigate(`/dashboard/produtos/${product.id}/lances`)}
                  icon={<FaEye className="size-6" />}
                  ariaLabel="Ver detalhes"
                  className="text-blue-500 hover:text-blue-700"
                />

                <IconButton
                  onClick={() => navigate(`/dashboard/produtos/${product.id}/edit`)}
                  icon={<CiEdit className="size-6" />}
                  ariaLabel="Editar"
                  className="text-yellow-500 hover:text-yellow-700"
                />

                <IconButton
                  onClick={() => handleDeleteConfirmation(product)}
                  icon={<CiTrash className="size-6" />}
                  ariaLabel="Excluir"
                  className="text-red-500 hover:text-red-700"
                />

                <IconButton
                  onClick={() => handleMarkAsSoldConfirmation(product)}
                  icon={<ImHammer2 className="size-6" />}
                  ariaLabel="Arrematar"
                  className="text-redDark hover:text-red-700"
                />
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
        message={`Tem certeza de que deseja excluir o Lote ${selectedProduct?.attributes.lot_number}?`}
        onConfirm={handleDelete}
        onCancel={() => setIsModalOpen(false)}
      />

      {selectedProduct && (
        <AuctionModal
          isOpen={isAuctionModalOpen}
          onClose={() => setIsAuctionModalOpen(false)}
          onConfirm={() => handleMarkAsSold(selectedProduct.id)}
          lotNumber={selectedProduct.attributes.lot_number}
          currentValue={selectedProduct.attributes.current_value || 0}
          winning_name={selectedProduct.attributes.winning_name || "Vencedor"}
        />
      )}
    </div>
  );
};

export default ProductManagement;
