import React, { useEffect, useState } from "react";
import { fetchCategories } from "../services/api";
import ImageUpload from "./ImageUploader";
import Button from "./Button";
import { Category } from "../types";

interface ProductFormProps {
  onSubmit: (formData: FormData) => void;
  initialData?: {
    lot_number: string;
    donor_name: string;
    donor_phone: string;
    minimum_value: string;
    bidder_name?: string;
    bidder_phone?: string;
    winning_value?: string;
    name: string;
    description: string;
    auctioned: number;
    category_id: string;
  };
  isSubmitting: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  onSubmit,
  initialData = {
    lot_number: "",
    donor_name: "",
    donor_phone: "",
    minimum_value: "",
    bidder_name: "",
    bidder_phone: "",
    winning_value: "",
    name: "",
    description: "",
    auctioned: 0,
    category_id: "",
  },
  isSubmitting,
}) => {
  const [productData, setProductData] = useState(initialData);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productImages, setProductImages] = useState<File[]>([]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data.data);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    };
    getCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    Object.entries(productData).forEach(([key, value]) => {
      formData.append(`product[${key}]`, typeof value === "number" ? value.toString() : value);
    });

    productImages.forEach((image) => {
      formData.append("product[images][]", image);
    });

    onSubmit(formData);
  };


  return (
    <div className="flex flex-wrap gap-6">
      <form onSubmit={handleSubmit} className="flex w-full gap-6">
        {/* Formulário de Dados */}
        <div className="w-full md:w-1/2 space-y-6">

          {/* Categoria */}
          <div>
            <label
              htmlFor="category_id"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Categoria
            </label>
            <select
              id="category_id"
              name="category_id"
              value={productData.category_id}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-redBright"
              required
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.attributes.title}
                </option>
              ))}
            </select>
          </div>

          {/* Número do Lote */}
          <div>
            <label
              htmlFor="lot_number"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Número do Lote
            </label>
            <input
              type="text"
              id="lot_number"
              name="lot_number"
              value={productData.lot_number}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-redBright"
              placeholder="Número do Lote"
              required
            />
          </div>

          {/* Nome do Doador */}
          <div>
            <label
              htmlFor="donor_name"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Nome do Doador
            </label>
            <input
              type="text"
              id="donor_name"
              name="donor_name"
              value={productData.donor_name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-redBright"
              placeholder="Nome do Doador"
              required
            />
          </div>

          {/* Telefone do Doador */}
          <div>
            <label
              htmlFor="donor_phone"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Telefone do Doador
            </label>
            <input
              type="tel"
              id="donor_phone"
              name="donor_phone"
              value={productData.donor_phone}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-redBright"
              placeholder="Telefone do Doador"
              required
            />
          </div>

          {/* Valor Mínimo */}
          <div>
            <label
              htmlFor="minimum_value"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Valor Mínimo
            </label>
            <input
              type="number"
              id="minimum_value"
              name="minimum_value"
              value={productData.minimum_value}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-redBright"
              placeholder="Valor Mínimo"
              required
            />
          </div>

          {/* Nome do Produto */}
          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Nome do Produto
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={productData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-redBright"
              placeholder="Nome do Produto"
              required
            />
          </div>

          {/* Descrição */}
          <div>
            <label
              htmlFor="description"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Descrição
            </label>
            <textarea
              id="description"
              name="description"
              value={productData.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-redBright"
              placeholder="Descrição"
              rows={4}
              required
            ></textarea>
          </div>
        </div>

        {/* Uploader de Imagens */}
        <div className="w-full flex flex-col items-center space-y-6">

          <label className="block text-sm font-medium text-gray-700">
            Upload de Imagens
          </label>
          <ImageUpload onImagesChange={setProductImages} />
          <Button
            text="Salvar Produto"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit(e as React.FormEvent<HTMLFormElement>);
            }}
            disabled={isSubmitting}
          />
        </div>
      </form>
    </div>

  );
};

export default ProductForm;
