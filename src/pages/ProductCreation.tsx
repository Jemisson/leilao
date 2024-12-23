import { useState } from "react";
import { createProduct } from "../services/api";
import ProductForm from "../components/ProductForm";
import { useNavigate } from "react-router-dom";

function ProductCreation () {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const handleCreateProduct = async (formData: FormData) => {
    setIsSubmitting(true);

    try {
      await createProduct(formData);
      navigate("/dashboard/produtos");
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      alert("Erro ao criar produto. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ProductForm onSubmit={handleCreateProduct} isSubmitting={isSubmitting} />
    </div>
  );
};

export default ProductCreation;
