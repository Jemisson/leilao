import React from "react";
import { FaTimes } from "react-icons/fa";
import { formatCurrency } from "../utils/currency";

interface VideoModalProps {
  isOpen: boolean;
  videoUrl: string;
  onClose: () => void;
  lotNumber: string;
  description: string;
  value: string | number;
}

const getYouTubeEmbedUrl = (url: string): string | null => {
  try {
    const youtubeRegex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/;
    const match = url.match(youtubeRegex);

    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }

    return null;
  } catch {
    return null;
  }
};

const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  videoUrl,
  onClose,
  lotNumber,
  description,
  value,
}) => {

  if (!isOpen) return null;

  const embedUrl = getYouTubeEmbedUrl(videoUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl relative dark:bg-gray-800">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 shadow-lg transition"
          title="Fechar"
        >
          <FaTimes className="w-6 h-6" />
        </button>
  
        {/* Infos acima do vídeo */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
            LOTE: {lotNumber}
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            {description}
          </p>
          <p className="text-lg font-semibold text-red-600 dark:text-red-400">
            Valor: {formatCurrency(Number(value))}
          </p>
        </div>

        {embedUrl ? (
          <div className="aspect-w-16 aspect-h-9 w-full">
            <iframe
              className="w-full h-96"
              src={embedUrl}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <p className="text-red-600 font-semibold">
            O link fornecido não é válido para exibição de vídeo do YouTube.
          </p>
        )}
      </div>
    </div>
  );

};

export default VideoModal;
