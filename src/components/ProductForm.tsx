import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { deleteImage, fetchCategories } from "../services/api";
import { Category, Product, ProductFormProps } from "../types";
import Button from "./Button";
import ImageUpload from "./ImageUploader";
import InputField from "./InputField";
import VideoModal from "./VideoModal";

const ProductForm: React.FC<ProductFormProps> = ({
  onSubmit,
  initialData = {},
  isSubmitting,
  mode,
}) => {
  const [productData, setProductData] =
    useState<Partial<Product["attributes"]>>(initialData);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productImages, setProductImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<
    { id: string; url: string }[]
  >([]);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  useEffect(() => {
    if (initialData?.category_title && categories.length > 0) {
      const matchedCategory = categories.find(
        (category) => category.attributes.title === initialData.category_title
      );
      if (matchedCategory) {
        setProductData((prevData) => ({
          ...prevData,
          category_id: matchedCategory.id,
        }));
      }
    }
    if (initialData?.images) {
      setExistingImages(initialData.images);
    }
  }, [initialData, categories]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data.data);
      } catch (err) {
        toast.error(`Erro ao carregar categorias: ${err}`);
      }
    };
    getCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setProductData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(productData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(`product[${key}]`, value.toString());
      }
    });

    productImages.forEach((image) => {
      formData.append("images[]", image);
    });

    onSubmit(formData);
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!initialData?.id || !imageId) return;

    try {
      await deleteImage(initialData.id, imageId);
      setExistingImages((prevImages) =>
        prevImages.filter((img) => img.id !== imageId)
      );
      toast.success("Imagem apagada com sucesso!");
    } catch (err) {
      toast.error(`Erro ao apagar imagem: ${err}`);
    }
  };

  return (
    <div className="flex flex-wrap gap-6">
      <h1 className="text-2xl font-bold">
        {mode === "edit" ? "Editar Produto" : "Cadastrar Produto"}
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row w-full gap-6"
      >
        <div className="w-full md:w-1/2 space-y-6 order-1">
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
              value={productData.category_id || ""}
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

          {[
            {
              label: "Número do Lote",
              name: "lot_number",
              type: "text" as const,
            },
            {
              label: "Nome do Doador",
              name: "donor_name",
              type: "text" as const,
            },
            {
              label: "Telefone do Doador",
              name: "donor_phone",
              type: "tel" as const,
              mask: "(99) 9 9999-9999",
              placeholder: "(00) 0 0000-0000",
            },
            {
              label: "Valor Mínimo",
              name: "minimum_value",
              type: "number" as const,
              placeholder: "0.00",
            },
            {
              label: "Link do vídeo (opcional)",
              name: "link_video",
              type: "text" as const,
              optional: true,
              placeholder: "https://...",
            },
          ].map(({ label, name, type, mask, optional, placeholder }) => {
            const value = (productData as any)[name] ?? "";

            return (
              <InputField
                key={name}
                label={label}
                name={name}
                type={type}
                value={value}
                onChange={handleChange}
                mask={mask}
                placeholder={placeholder ?? label}
                required={!optional}
                inputMode={
                  type === "number"
                    ? "decimal"
                    : type === "tel"
                    ? "tel"
                    : undefined
                }
              />
            );
          })}

          {productData.link_video && (
            <div>
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(true)}
                className="text-blue-600 underline hover:text-blue-800 transition"
              >
                Ver vídeo
              </button>
            </div>
          )}

          <div>
            <label
              htmlFor="description"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Descrição (Obrigatório)
            </label>
            <textarea
              id="description"
              name="description"
              value={productData.description || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-redBright"
              placeholder="Descrição"
              rows={4}
              required
            ></textarea>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col items-center space-y-6 order-2">
          <label className="block text-2xl font-medium text-gray-700">
            Envio de Imagens
          </label>

          <ImageUpload onImagesChange={setProductImages} />

          <div className="flex flex-wrap justify-between">
            {existingImages.map((image) => (
              <div key={image.id} className="relative">
                <img
                  src={image.url}
                  alt="Produto"
                  className="w-full h-24 object-cover rounded border border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(image.id)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 removerr"
                >
                  X
                </button>
              </div>
            ))}
          </div>

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

      <VideoModal
        isOpen={isVideoModalOpen}
        videoUrl={productData.link_video || ""}
        onClose={() => setIsVideoModalOpen(false)}
        lotNumber={productData.lot_number || ""}
        description={productData.description || ""}
        value={productData.minimum_value || ""}
      />
    </div>
  );
};

export default ProductForm;
