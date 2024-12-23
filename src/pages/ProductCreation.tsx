import React, { useState, useEffect } from "react";
import { createProduct, fetchCategories } from "../services/api";
import Button from "../components/Button";
import { Category } from "../types";

const ProductCreationForm: React.FC = () => {
  const [productData, setProductData] = useState({
    lot_number: "",
    donor_name: "",
    donor_phone: "",
    minimum_value: "",
    name: "",
    description: "",
    auctioned: 0,
    category_id: 0,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const payload = {
        ...productData,
        minimum_value: parseFloat(productData.minimum_value), // Convert string to number
      };
      await createProduct(payload);
      setMessage("Produto cadastrado com sucesso!");
      setProductData({
        lot_number: "",
        donor_name: "",
        donor_phone: "",
        minimum_value: "",
        name: "",
        description: "",
        auctioned: 0,
        category_id: 0,
      });
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
      setMessage("Erro ao cadastrar produto. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Cadastrar Produto</h1>
      {message && (
        <p
          className={`mb-4 text-sm font-medium ${
            message.includes("sucesso") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
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

        {/* Botão de Enviar */}
        <div>
        <Button
          text="Cadastrar Produto"
          onClick={(e) => {
            e.preventDefault(); // Previne o comportamento padrão do formulário
            handleSubmit(e as React.FormEvent<HTMLFormElement>); // Converte o evento corretamente
          }}
          disabled={isSubmitting}
        />
        </div>
      </form>
    </div>
  );
};

export default ProductCreationForm;
