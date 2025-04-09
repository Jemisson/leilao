import React, { useCallback, useEffect, useState } from "react";
import { CiEdit, CiTrash } from "react-icons/ci";
import { FaEye } from "react-icons/fa";
import { ImHammer2 } from "react-icons/im";
import { MdContentCopy } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import AuctionModal from "../components/AuctionModal";
import Button from "../components/Button";
import ConfirmationModal from "../components/ConfirmationModal";
import IconButton from "../components/IconButton";
import Pagination from "../components/Pagination";
import { createProduct, deleteProduct, fetchProducts, searchProducts, soldProduct } from "../services/api";
import { Product } from "../types";

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuctionModalOpen, setIsAuctionModalOpen] = useState(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [auctioned, setAuctioned] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const loadProducts = useCallback(async (page = 1, auctionedValue = auctioned) => {
    try {
      const data = await fetchProducts(page, null , auctionedValue);
      setProducts(data.data);
      setTotalPages(data.meta.total_pages);
    } catch (err) {
      setError("Erro ao carregar produtos.");
      toast.error(`Erro ao carregar produto: ${err}`);
    } finally {
      setLoading(false);
    }
  }, [auctioned]);

  useEffect(() => {
    setLoading(true);
    loadProducts(currentPage, auctioned);
  }, [currentPage, auctioned, loadProducts]);

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
        toast.success("Produto excluído com sucesso!");
      } catch (err) {
        toast.error(`Erro ao excluir produto: ${err}`);
      }
    }
  };

  const handleMarkAsSoldConfirmation = (product: Product) => {
    setSelectedProduct(product);
    setIsAuctionModalOpen(true);
  };

  const handleMarkAsSold = async (productId: number) => {
    if (productId) {
      try {
        await soldProduct(productId);
        setProducts(products.filter((product) => product.id !== productId));
        setIsAuctionModalOpen(false);
        toast.success("Lote arrematado com sucesso!");
      } catch (err) {
        toast.error(`Erro ao arrematar produto: ${err}`);
      }
    }
  };

  const handleAddProduct = () => {
    navigate("/dashboard/produtos/new");
  };

  const handleDuplicateConfirmation = (product: Product) => {
    setSelectedProduct(product);
    setIsDuplicateModalOpen(true);
  };

  const handleConfirmDuplicate = async () => {
    if (!selectedProduct) return;

    setIsDuplicateModalOpen(false);

    const newLotNumber = `${selectedProduct.attributes.lot_number.replace(/[A-Z]?$/, '')}${String.fromCharCode((selectedProduct.attributes.lot_number.match(/[A-Z]$/) ? selectedProduct.attributes.lot_number.slice(-1).charCodeAt(0) : 64) + 1)}`;

    const duplicatedProduct = new FormData();

    duplicatedProduct.append("product[category_id]", selectedProduct.attributes.category_id);
    duplicatedProduct.append("product[lot_number]", newLotNumber);
    duplicatedProduct.append("product[donor_name]", selectedProduct.attributes.donor_name || "");
    duplicatedProduct.append("product[donor_phone]", selectedProduct.attributes.donor_phone || "");
    if (selectedProduct.attributes.minimum_value !== undefined) {
      duplicatedProduct.append("product[minimum_value]", selectedProduct.attributes.minimum_value.toString());
    }
    duplicatedProduct.append("product[description]", selectedProduct.attributes.description || "");

    if (selectedProduct.attributes.images && selectedProduct.attributes.images.length > 0) {
      await Promise.all(
        selectedProduct.attributes.images.map(async (image) => {
          const response = await fetch(image.url);
          const blob = await response.blob();
          duplicatedProduct.append("images[]", blob, `duplicated-${image.id}.jpg`);
        })
      );
    }

    try {
      await createProduct(duplicatedProduct);
      toast.success("Produto duplicado com sucesso!");
    } catch (error) {
      toast.error(`Erro ao duplicar produto: ${error}`);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query) {
      setCurrentPage(1);
      setLoading(true);
      return;
    }

    setLoading(true);
    try {
      const data = await searchProducts(query, auctioned);
      setProducts(data.data);
      setTotalPages(data.meta.total_pages);
    } catch (err) {
      toast.error(`Erro ao buscar produtos: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciamento de Produtos</h1>
        <Button text="Adicionar Produto" onClick={handleAddProduct} />
      </div>

      <div className="mb-4">
        <span className="mr-4 font-semibold">Exibir produtos:</span>
        <div className="inline-flex space-x-2">
          <button
            className={`px-4 py-2 rounded-full border ${
              auctioned === 0 ? "bg-redDark text-white" : "bg-white text-gray-700 border-gray-300"
            }`}
            onClick={() => {
              setAuctioned(0);
              setCurrentPage(1);
              setLoading(true);
            }}
          >
            Não arrematados
          </button>
          <button
            className={`px-4 py-2 rounded-full border ${
              auctioned === 1 ? "bg-redDark text-white" : "bg-white text-gray-700 border-gray-300"
            }`}
            onClick={() => {
              setAuctioned(1);
              setCurrentPage(1);
              setLoading(true);
            }}
          >
            Arrematados
          </button>
        </div>
      </div>

      <div className="flex gap-2 w-full md:w-1/2 mb-5">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Buscar por lote, descrição, valor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 pr-10 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-redBright"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setCurrentPage(1);
                setLoading(true);
                loadProducts(1);
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-600 text-lg"
              aria-label="Limpar busca"
            >
              ×
            </button>
          )}
        </div>

        <button
          onClick={() => handleSearch(searchQuery)}
          className="bg-redDark text-white px-4 py-2 rounded hover:bg-redBright shrink-0"
        >
          Buscar
        </button>
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

                {product.attributes.auctioned !== 1 && (
                  <IconButton
                    onClick={() => navigate(`/dashboard/produtos/${product.id}/edit`)}
                    icon={<CiEdit className="size-6" />}
                    ariaLabel="Editar"
                    className="text-yellow-500 hover:text-yellow-700"
                  />
                )}

                {product.attributes.auctioned !== 1 && (
                  <IconButton
                    onClick={() => handleDeleteConfirmation(product)}
                    icon={<CiTrash className="size-6" />}
                    ariaLabel="Excluir"
                    className="text-red-500 hover:text-red-700"
                  />
                )}

                <IconButton
                  onClick={() =>  handleDuplicateConfirmation(product)}
                  icon={<MdContentCopy className="size-6" />}
                  ariaLabel="Duplicar Produto"
                  className="text-green-500 hover:text-green-700"
                />

                {product.attributes.auctioned !== 1 && (
                  <IconButton
                    onClick={() => handleMarkAsSoldConfirmation(product)}
                    icon={<ImHammer2 className="size-6" />}
                    ariaLabel="Arrematar"
                    className="text-redDark hover:text-red-700"
                  />
                )}
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
        warning="Atenção, ao excluir um produto você também apagará todos os lances feitos a ele!"
        message={`Tem certeza de que deseja excluir o Lote ${selectedProduct?.attributes.lot_number}?`}
        onConfirm={handleDelete}
        onCancel={() => setIsModalOpen(false)}
      />

      <ConfirmationModal
        isOpen={isDuplicateModalOpen}
        title="Confirmar Duplicação"
        message={`Tem certeza de que deseja duplicar o lote: ${selectedProduct?.attributes.lot_number}`}
        onConfirm={handleConfirmDuplicate}
        onCancel={() => setIsDuplicateModalOpen(false)}
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
