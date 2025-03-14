import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProductById, updateProduct } from "../services/api";
import { Product } from "../types";
import ProductForm from "../components/ProductForm";
import { toast } from "react-toastify";

function ProductEdit() {
  const [productData, setProductData] = useState<Partial<Product["attributes"]> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const getProductData = async () => {
      try {
        if (!productId) throw new Error("ID do produto não informado.");
        const data = await fetchProductById(Number(productId));
        if (data?.data?.attributes) {
          setProductData(data.data.attributes);
        } else {
          throw new Error("Formato inesperado de dados do produto.");
        }
      } catch (err) {
        toast.error(`Erro ao buscar produto: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    getProductData();
  }, [productId]);

  const handleUpdateProduct = async (formData: FormData) => {
    setIsSubmitting(true);

    try {
      await updateProduct(Number(productId), formData);
      navigate("/dashboard/produtos");
      toast.success("Produto atualizado com sucesso!");
    } catch (err) {
      toast.error(`Erro ao atualizar produto: ${err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !productData) return <p>Carregando...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ProductForm
        onSubmit={handleUpdateProduct}
        initialData={productData}
        isSubmitting={isSubmitting}
        mode="edit"
      />
    </div>
  );
}

export default ProductEdit;
