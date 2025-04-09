import { useState } from "react";
import { ProductCardProps } from "../types";
import { FaPlayCircle } from "react-icons/fa";
import VideoModal from "./VideoModal";

const ProductCard = ({ product, isUpdated, onBid }: ProductCardProps) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <div
      className={`relative max-w-sm bg-white border  rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 ${isUpdated ? " border-2 border-solid border-gold" : "border-gray-200"}`}
      key={product.id}
    >
      <div className="relative">
        <img
          className="rounded-t-lg w-full h-48 object-cover"
          src={
            product.attributes.images && product.attributes.images.length > 0
              ? product.attributes.images[0].url
              : "/empty.png"
          }
          alt={product.attributes.description || "Imagem do produto"}
        />
        <span className="absolute bottom-2 right-2 bg-redDark text-beige text-xs font-semibold px-2 py-1 rounded-lg shadow">
          {product.attributes.category_title}
        </span>

        {product.attributes.link_video && (
          <button
            type="button"
            onClick={() => setIsVideoModalOpen(true)}
            className="absolute top-2 right-2 text-redDark hover:text-red-500 transition"
            title="Ver vídeo do produto"
          >
            <FaPlayCircle className="w-7 h-7 drop-shadow-md" />
          </button>
        )}
      </div>

      <div className="p-5">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          LOTE: {product.attributes.lot_number}
        </h5>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {product.attributes.description || ""}
        </p>
        <p className={`mb-3 font-semibold text-lg ${isUpdated ? "text-redBright" : "text-gray-900"}`}>
          Valor: R$ {product.attributes.current_value}
        </p>
        <button
          type="button"
          onClick={onBid}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white !bg-redDark rounded-lg hover:bg-redBright focus:ring-4 focus:outline-none focus:ring-redBright dark:bg-redBright"
        >
          Fazer um Lance
          <svg
            className="w-4 h-4 ml-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 9l-5 5-5-5" />
          </svg>
        </button>
      </div>

      {product.attributes.link_video && (
        <VideoModal
          isOpen={isVideoModalOpen}
          videoUrl={product.attributes.link_video}
          onClose={() => setIsVideoModalOpen(false)}
        />
      )}

    </div>
  );
};

export default ProductCard;
