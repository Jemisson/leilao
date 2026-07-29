// components/ProductDetailsModal.tsx
import React from "react";
import { FaPlayCircle, FaStar, FaTimes } from "react-icons/fa";
import { formatCurrency } from "../utils/currency";

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  description: string;
  value?: string | number;
  lotNumber?: string;
  videoUrl?: string | null;
  showProductValue?: boolean;
  featured?: boolean;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  description,
  value,
  lotNumber,
  videoUrl,
  showProductValue = true,
  featured = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full md:w-auto md:max-w-[90vw] relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 shadow-lg transition"
          title="Fechar"
        >
          <FaTimes className="w-6 h-6" />
        </button>

        <img
          src={imageUrl}
          alt={description || "Imagem do produto"}
          className="w-full max-h-[60vh] object-contain rounded-t-lg"
        />

        {videoUrl && (
          <FaPlayCircle
            title="Este produto tem vídeo"
            className="absolute bottom-2 right-2 w-8 h-8 text-red-600 hover:text-red-400 drop-shadow-lg cursor-pointer"
          />
        )}

        <div className="p-5">
          {lotNumber && (
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                LOTE: {lotNumber}
              </h3>
              {featured && (
                <span className="inline-flex items-center gap-1 rounded-md bg-pinkDark/10 px-2 py-1 text-xs font-bold text-pinkDark">
                  <FaStar className="h-3 w-3" />
                  Destaque
                </span>
              )}
            </div>
          )}
          <p className="text-gray-700 dark:text-gray-300 mb-4">{description}</p>
          {showProductValue && value !== undefined && value !== null && (
            <p className="text-lg font-semibold text-red-600 dark:text-red-400">
              Valor: {formatCurrency(Number(value))}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
