import { useState } from "react";
import { createProduct } from "../services/api";
import ProductForm from "../components/ProductForm";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ProductCreation () {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const handleCreateProduct = async (formData: FormData) => {
    setIsSubmitting(true);

    try {
      await createProduct(formData);
      navigate("/dashboard/produtos");
    } catch (err) {
      toast.error(`Erro ao criar produto: ${err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ProductForm
        onSubmit={handleCreateProduct}
        isSubmitting={isSubmitting}
        mode={"create"}
      />
    </div>
  );
};

export default ProductCreation;
