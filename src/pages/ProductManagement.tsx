import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import PageHeader from "../components/PageHeader";
import Pagination from "../components/Pagination";
import { useCatalogSettings } from "../hooks/useCatalogSettings";
import { createProduct, deleteProduct, fetchCategories, fetchProducts, searchProducts, soldProduct } from "../services/api";
import { Category, MarkAsSoldPayload, Product } from "../types";
import { formatCurrency } from "../utils/currency";

type ProductManagementOrder = "default" | "lot_asc" | "lot_desc";

const lotNumberCollator = new Intl.Collator("pt-BR", {
  numeric: true,
  sensitivity: "base",
});

const sortProductsByLotNumber = (products: Product[], order: ProductManagementOrder) => {
  if (order === "default") return products;

  return [...products].sort((productA, productB) => {
    const comparison = lotNumberCollator.compare(
      productA.attributes.lot_number || "",
      productB.attributes.lot_number || ""
    );

    return order === "lot_asc" ? comparison : -comparison;
  });
};

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [order, setOrder] = useState<ProductManagementOrder>("default");
  const { showProductValues } = useCatalogSettings();

  const orderParams = useMemo(() => {
    return order === "default"
      ? {}
      : {
          orderBy: "lot" as const,
          orderDirection: order === "lot_asc" ? "asc" as const : "desc" as const,
        };
  }, [order]);

  const loadProducts = useCallback(async (page = 1, auctionedValue = auctioned) => {
    try {
      setError(null);
      const data = await fetchProducts(page, selectedCategory, auctionedValue, orderParams);
      const fetchedProducts = Array.isArray(data.data) ? data.data : [];
      setProducts(sortProductsByLotNumber(fetchedProducts, order));
      setTotalPages(data.meta.total_pages ?? 1);
    } catch (err) {
      setError("Erro ao carregar produtos.");
      toast.error(`Erro ao carregar produto: ${err}`);
    } finally {
      setLoading(false);
    }
  }, [auctioned, selectedCategory, orderParams, order]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        toast.error(`Erro ao carregar categorias: ${err}`);
        setCategories([]);
      }
    };

    getCategories();
  }, []);

  useEffect(() => {
    const trimmedQuery = searchQuery.trim();

    if (trimmedQuery.length >= 2) {
      const timeoutId = window.setTimeout(async () => {
        setLoading(true);
        setError(null);

        try {
          const data = await searchProducts(trimmedQuery, auctioned, currentPage, {
            categoryId: selectedCategory,
            ...orderParams,
          });
          const fetchedProducts = Array.isArray(data.data) ? data.data : [];
          setProducts(sortProductsByLotNumber(fetchedProducts, order));
          setTotalPages(data.meta?.total_pages ?? 1);
        } catch (err) {
          setError("Erro ao buscar produtos.");
          toast.error(`Erro ao buscar produtos: ${err}`);
        } finally {
          setLoading(false);
        }
      }, 300);

      return () => window.clearTimeout(timeoutId);
    }

    if (trimmedQuery.length === 0) {
      setLoading(true);
      loadProducts(currentPage, auctioned);
    }
  }, [currentPage, auctioned, loadProducts, searchQuery, selectedCategory, orderParams, order]);

  const reloadCurrentProductTable = async () => {
    const trimmedQuery = searchQuery.trim();

    setLoading(true);
    setError(null);

    try {
      const data = trimmedQuery.length >= 2
        ? await searchProducts(trimmedQuery, auctioned, currentPage, {
            categoryId: selectedCategory,
            ...orderParams,
          })
        : await fetchProducts(currentPage, selectedCategory, auctioned, orderParams);
      const fetchedProducts = Array.isArray(data.data) ? data.data : [];

      setProducts(sortProductsByLotNumber(fetchedProducts, order));
      setTotalPages(data.meta?.total_pages ?? 1);
    } catch (err) {
      setError("Erro ao carregar produtos.");
      toast.error(`Erro ao recarregar produtos: ${err}`);
    } finally {
      setLoading(false);
    }
  };

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

  const handleMarkAsSold = async (productId: number, auctionData: MarkAsSoldPayload) => {
    if (productId) {
      try {
        const response = await soldProduct(productId, auctionData);
        const updatedProduct = response.data as Product | undefined;

        setProducts((currentProducts) => {
          if (auctioned === 0) {
            return currentProducts.filter((product) => product.id !== productId);
          }

          return currentProducts.map((product) => (
            product.id === productId && updatedProduct ? updatedProduct : product
          ));
        });
        setIsAuctionModalOpen(false);
        if (auctioned === 1) {
          await reloadCurrentProductTable();
        }
        toast.success(auctioned === 1 ? "Arremate atualizado com sucesso!" : "Lote arrematado com sucesso!");
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
    duplicatedProduct.append("product[featured]", Boolean(selectedProduct.attributes.featured).toString());
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

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex flex-col flex-grow">
      <main className="flex-grow p-6">

        <PageHeader
          title="Gerenciamento de Produtos"
          icon={<ImHammer2 className="h-5 w-5" />}
          actions={<Button text="Adicionar Produto" onClick={handleAddProduct} />}
        />

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

        <div className="mb-5 grid gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm lg:grid-cols-[minmax(0,_1fr)_220px_220px]">
          <div className="relative w-full">
            <label htmlFor="product-management-search" className="mb-2 block text-sm font-bold text-gray-700">
              Busca
            </label>
            <input
              id="product-management-search"
              type="text"
              placeholder="Buscar por lote, descrição, valor..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="h-11 w-full rounded-md border border-gray-300 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-redBright"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-600 text-lg"
                aria-label="Limpar busca"
              >
              ×
              </button>
            )}
          </div>

          <div>
            <label htmlFor="product-management-category" className="mb-2 block text-sm font-bold text-gray-700">
              Categoria
            </label>
            <select
              id="product-management-category"
              value={selectedCategory || ""}
              onChange={(event) => {
                setSelectedCategory(event.target.value || null);
                setCurrentPage(1);
                setLoading(true);
              }}
              className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-redBright"
            >
              <option value="">Todas as categorias</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.attributes.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="product-management-order" className="mb-2 block text-sm font-bold text-gray-700">
              Ordenação
            </label>
            <select
              id="product-management-order"
              value={order}
              onChange={(event) => {
                setOrder(event.target.value as ProductManagementOrder);
                setCurrentPage(1);
                setLoading(true);
              }}
              className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-redBright"
            >
              <option value="default">Padrão</option>
              <option value="lot_asc">Lote crescente</option>
              <option value="lot_desc">Lote decrescente</option>
            </select>
          </div>
        </div>


        <table className="min-w-full bg-white border border-gray-300 shadow-sm rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Imagem</th> 
              <th className="py-2 px-4 border-b">Lote</th>
              <th className="py-2 px-4 border-b">Destaque</th>
              <th className="py-2 px-4 border-b">Categoria</th>
              <th className="py-2 px-4 border-b">Nome</th>
              {auctioned === 1 && <th className="py-2 px-4 border-b whitespace-nowrap">Comprador</th>}
              {auctioned === 1 && <th className="py-2 px-4 border-b whitespace-nowrap">Telefone</th>}
              {showProductValues && <th className="py-2 px-4 border-b whitespace-nowrap">Valor</th>}
              <th className="py-2 px-4 border-b whitespace-nowrap">Ações</th>
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
                <td className="py-2 px-4 border-b text-center">
                  {product.attributes.featured ? (
                    <span className="rounded-md bg-pinkDark/10 px-2 py-1 text-xs font-bold text-pinkDark">
                      Sim
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="py-2 px-4 border-b  text-center">{product.attributes.category_title}</td>
                <td className="py-2 px-4 border-b">
                  {product.attributes.description}
                </td>
                {auctioned === 1 && (
                  <td className="py-2 px-4 border-b whitespace-nowrap text-center">
                    {product.attributes.bidder_name || product.attributes.winning_name || "-"}
                  </td>
                )}
                {auctioned === 1 && (
                  <td className="py-2 px-4 border-b whitespace-nowrap text-center">
                    {product.attributes.bidder_phone || "-"}
                  </td>
                )}
                {showProductValues && (
                  <td className="py-2 px-4 border-b text-center whitespace-nowrap">
                    {product.attributes.winning_value !== undefined
                      ? formatCurrency(Number(product.attributes.winning_value))
                      : product.attributes.current_value !== undefined
                        ? formatCurrency(Number(product.attributes.current_value))
                      : "-"}
                  </td>
                )}
                <td className="py-2 px-4 border-b">
                  <div className="flex flex-nowrap items-center justify-center gap-1 whitespace-nowrap">
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

                    {product.attributes.auctioned === 1 && (
                      <IconButton
                        onClick={() => handleMarkAsSoldConfirmation(product)}
                        icon={<CiEdit className="size-6" />}
                        ariaLabel="Editar arremate"
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
                  </div>
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
            onConfirm={(auctionData) => handleMarkAsSold(selectedProduct.id, auctionData)}
            lotNumber={selectedProduct.attributes.lot_number}
            currentValue={selectedProduct.attributes.current_value || 0}
            showCurrentValue={showProductValues && selectedProduct.attributes.current_value !== undefined}
            initialData={selectedProduct.attributes.auctioned === 1 ? {
              bidder_name: selectedProduct.attributes.bidder_name || selectedProduct.attributes.winning_name || "",
              bidder_phone: selectedProduct.attributes.bidder_phone || "",
              winning_value: Number(selectedProduct.attributes.winning_value ?? selectedProduct.attributes.current_value ?? 0),
            } : undefined}
            mode={selectedProduct.attributes.auctioned === 1 ? "edit" : "create"}
          />
        )}
      </main>
    </div>
  );
};

export default ProductManagement;
