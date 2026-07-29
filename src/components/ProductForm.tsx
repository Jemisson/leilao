import React, { useEffect, useState } from "react";
import { deleteImage, fetchCategories } from "../services/api";
import ImageUpload from "./ImageUploader";
import Button from "./Button";
import { Category, Product, ProductFormProps } from "../types";
import { toast } from "react-toastify";
import VideoModal from "./VideoModal";
import { FaImage, FaInfoCircle, FaPlayCircle, FaStar } from "react-icons/fa";

const RequiredMark = () => <span className="text-redBright"> *</span>;
const inputClassName = "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-redBright";
const labelClassName = "mb-2 block text-sm font-semibold text-gray-700";

const ProductForm: React.FC<ProductFormProps> = ({
  onSubmit,
  initialData = {},
  isSubmitting,
}) => {
  const [productData, setProductData] = useState<Partial<Product["attributes"]>>(initialData);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productImages, setProductImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<{ id: string; url: string }[]>([]);
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
    if (initialData?.images && Array.isArray(initialData.images)) {
      setExistingImages(initialData.images);
    }
  }, [initialData, categories]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        if (Array.isArray(data.data)) {
          setCategories(data.data);
        } else {
          setCategories([]);
        }
      } catch (err) {
        toast.error(`Erro ao carregar categorias: ${err}`);
      }
    };
    getCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = e.target instanceof HTMLInputElement && e.target.type === "checkbox"
      ? e.target.checked
      : e.target.value;

    setProductData((prevData) => ({
      ...prevData,
      [e.target.name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(productData).forEach(([key, value]) => {
      if (key !== "featured" && value !== undefined && value !== null) {
        formData.append(`product[${key}]`, value.toString());
      }
    });
    formData.append("product[featured]", Boolean(productData.featured).toString());

    productImages.forEach((image) => {
      formData.append("images[]", image);
    });

    onSubmit(formData);
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!initialData?.id || !imageId) return;

    try {
      await deleteImage(initialData.id, imageId);
      setExistingImages((prevImages) => prevImages.filter((img) => img.id !== imageId));
      toast.success("Imagem apagada com sucesso!");
    } catch (err) {
      toast.error(`Erro ao apagar imagem: ${err}`);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="grid w-full gap-6 lg:grid-cols-[minmax(0,_1fr)_minmax(320px,_0.8fr)]">

        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blueBright/10 text-blueBright">
              <FaInfoCircle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Dados do produto</h2>
              <p className="text-sm text-gray-600">Preencha as informações que identificam o lote no catálogo.</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
            <label
              htmlFor="category_id"
              className={labelClassName}
            >
              Categoria<RequiredMark />
            </label>
            <select
              id="category_id"
              name="category_id"
              value={productData.category_id || ""}
              onChange={handleChange}
              className={inputClassName}
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

            <div className="grid gap-5 sm:grid-cols-2">
              {[
                { label: "Número do Lote", name: "lot_number", type: "text", required: true },
                { label: "Valor Mínimo", name: "minimum_value", type: "number", required: true },
              ].map(({ label, name, type, required }) => {

                const value = productData[name as keyof Pick<Product["attributes"], "lot_number" | "minimum_value">];

                return (
                  <div key={name}>
                    <label htmlFor={name} className={labelClassName}>
                      {label}{required && <RequiredMark />}
                    </label>
                    <input
                      id={name}
                      name={name}
                      type={type}
                      value={value || ""}
                      onChange={handleChange}
                      className={inputClassName}
                      placeholder={label}
                      required={required}
                    />
                  </div>
                );
              })}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {[
                { label: "Nome do Doador", name: "donor_name", type: "text" },
                { label: "Telefone do Doador", name: "donor_phone", type: "tel" },
              ].map(({ label, name, type }) => {

                const value = productData[name as keyof Pick<Product["attributes"], "donor_name" | "donor_phone">];

                return (
                  <div key={name}>
                    <label htmlFor={name} className={labelClassName}>
                      {label}
                    </label>
                    <input
                      id={name}
                      name={name}
                      type={type}
                      value={value || ""}
                      onChange={handleChange}
                      className={inputClassName}
                      placeholder={label}
                    />
                  </div>
                );
              })}
            </div>

            <div>
              <label htmlFor="link_video" className={labelClassName}>
                Link do vídeo
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  id="link_video"
                  name="link_video"
                  type="text"
                  value={productData.link_video || ""}
                  onChange={handleChange}
                  className={inputClassName}
                  placeholder="Link do vídeo (opcional)"
                />
                {productData.link_video && (
                  <button
                    type="button"
                    onClick={() => setIsVideoModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-blueBright px-4 py-2 font-semibold text-blueBright transition hover:bg-blueBright hover:text-white"
                  >
                    <FaPlayCircle className="h-4 w-4" />
                    Ver vídeo
                  </button>
                )}
              </div>
            </div>

          <label className="flex items-start gap-3 rounded-lg border border-pinkDark/20 bg-pinkDark/5 p-4">
            <input
              type="checkbox"
              name="featured"
              checked={Boolean(productData.featured)}
              onChange={handleChange}
              className="mt-1 h-5 w-5 rounded border-gray-300 text-pinkDark focus:ring-redBright"
            />
            <span>
              <span className="flex items-center gap-2 text-sm font-bold text-gray-800">
                <FaStar className="h-4 w-4 text-pinkDark" />
                Produto em destaque
              </span>
              <span className="block text-sm text-gray-600">
                Produtos destacados aparecem com um indicador visual no catálogo.
              </span>
            </span>
          </label>

          <div>
            <label htmlFor="description" className={labelClassName}>
              Descrição<RequiredMark />
            </label>
            <textarea
              id="description"
              name="description"
              value={productData.description || ""}
              onChange={handleChange}
              className={`${inputClassName} min-h-32`}
              placeholder="Descrição"
              rows={4}
              required
            ></textarea>
          </div>
          </div>
        </section>

        <aside className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blueBright/10 text-blueBright">
              <FaImage className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Imagens</h2>
              <p className="text-sm text-gray-600">Adicione fotos para exibir o produto no catálogo.</p>
            </div>
          </div>

          <ImageUpload onImagesChange={setProductImages} />

          <div className="mt-6 grid grid-cols-2 gap-3">
            {existingImages.map((image) => (
              <div key={image.id} className="relative overflow-hidden rounded-lg border border-gray-200">
                <img
                  src={image.url}
                  alt="Produto"
                  className="h-28 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(image.id)}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white shadow hover:bg-red-600"
                  aria-label="Remover imagem"
                >
                  X
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <Button
              text={isSubmitting ? "Salvando..." : "Salvar Produto"}
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(e as React.FormEvent<HTMLFormElement>);
              }}
              disabled={isSubmitting}
              className="w-full"
            />
            <p className="mt-3 text-center text-xs text-gray-500">
              Campos marcados com <RequiredMark /> são obrigatórios.
            </p>
          </div>
        </aside>
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
