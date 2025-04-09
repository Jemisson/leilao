import React from "react";

interface VideoModalProps {
  isOpen: boolean;
  videoUrl: string;
  onClose: () => void;
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

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, videoUrl, onClose }) => {
  if (!isOpen) return null;

  const embedUrl = getYouTubeEmbedUrl(videoUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white p-4 rounded-lg w-full max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600 font-bold text-xl"
        >
          &times;
        </button>

        {embedUrl ? (
          <div className="aspect-w-16 aspect-h-9 w-full">
            <iframe
              className="w-full h-96"
              src={embedUrl}
              title="YouTube video player"
              frameBorder="0"
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
