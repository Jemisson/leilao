import { FaEye, FaPlayCircle, FaShareAlt, FaStar } from "react-icons/fa";
import { ProductCardProps } from "../types";
import { formatCurrency } from "../utils/currency";
import { toast } from "react-toastify";
import { getAuthenticatedUser } from "../utils/authHelpers";
import { buildShareProductUrl } from "../config/backend";
import { ImHammer2 } from "react-icons/im";

const ProductCard = ({ product, isUpdated, onBid, onViewDetails, showProductValues }: ProductCardProps) => {

  const user = getAuthenticatedUser();
  const isAdmin = user?.role === "admin";
  const currentValue = Number(product.attributes.current_value ?? product.attributes.minimum_value ?? 0);

  return (
    <article
      className={`relative flex h-full w-full flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl ${
        isUpdated ? "border-pinkDark ring-2 ring-pinkDark/30" : "border-gray-200"
      }`}
      key={product.id}
    >

      <button
        type="button"
        className="group relative block w-full overflow-hidden text-left"
        onClick={onViewDetails}
      >
        <img
          className="h-56 w-full object-cover transition duration-300 group-hover:scale-105"
          src={
            product.attributes.images && product.attributes.images.length > 0
              ? product.attributes.images[0].url
              : "/empty.png"
          }
          alt={product.attributes.description || "Imagem do produto"}
        />
        <span className="absolute right-3 top-3 max-w-[calc(100%-1.5rem)] truncate rounded-md bg-blueBright px-3 py-1.5 text-xs font-bold text-white shadow">
          {product.attributes.category_title}
        </span>
        <span className="absolute bottom-3 left-3 rounded-md bg-white px-3 py-2 text-sm font-extrabold text-black shadow">
          LOTE {product.attributes.lot_number}
        </span>
        {product.attributes.featured && (
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1.5 text-xs font-bold text-pinkDark shadow">
            <FaStar className="h-3.5 w-3.5" />
            Destaque
          </span>
        )}

        {product.attributes.link_video && (
          <FaPlayCircle className="absolute left-3 top-3 h-8 w-8 fill-white text-pinkDark drop-shadow-md" />
        )}
      </button>

      <div className="flex flex-1 flex-col p-4">

      {showProductValues && (
        <div className="mb-4">
          <div className="rounded-md border border-pinkDark/30 bg-pinkDark/10 p-3">
            <p className="text-xs font-bold uppercase text-pinkDark">
              Lance atual
            </p>
            <p className={`whitespace-nowrap text-lg font-extrabold leading-tight tracking-normal ${isUpdated ? "text-pinkDark" : "text-gray-950"}`}>
              {formatCurrency(currentValue)}
            </p>
          </div>
        </div>
      )}

        <p className="line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-gray-700">
          {product.attributes.description || ""}
        </p>

        <div className="mt-auto pt-5">
          <button
            type="button"
            title="Compartilhar"
            aria-label="Compartilhar lote"
            className="mb-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-pinkDark px-3 text-sm font-bold text-pinkDark transition hover:bg-pinkDark hover:text-white"
            onClick={() => {
              const shareUrl = buildShareProductUrl(product.id);
              const text = `Confira este produto: LOTE ${product.attributes.lot_number}`;

              if (navigator.share) {
                navigator.share({
                  title: "23° Leilão Direito de Viver.",
                  text,
                  url: shareUrl,
                }).catch((err) => console.log("Erro ao compartilhar:", err));
              } else {
                navigator.clipboard.writeText(shareUrl).then(() => {
                  toast.success("Link copiado!")
                });
              }
            }}
          >
            <FaShareAlt className="h-4 w-4" />
            Compartilhar
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onViewDetails}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-md border border-blueBright px-3 text-sm font-bold text-blueBright transition hover:bg-blueBright hover:text-white"
            >
              <FaEye className="h-4 w-4" />
              Ver detalhes
            </button>
            {isAdmin && (
              <button
                type="button"
                onClick={onBid}
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-md bg-pinkDark px-3 text-sm font-bold text-white transition hover:bg-redBright focus:outline-none focus:ring-2 focus:ring-pinkDark"
              >
                <ImHammer2 className="h-4 w-4" />
                Lance
              </button>
            )}
          </div>
        </div>
      </div>

    </article>
  );
};

export default ProductCard;
