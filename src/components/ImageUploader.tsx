import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface ImageUploadProps {
  onImagesChange: (files: File[]) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImagesChange }) => {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [...uploadedImages, ...acceptedFiles];
      setUploadedImages(newFiles);
      onImagesChange(newFiles);
    },
    [uploadedImages, onImagesChange]
  );

  const removeImage = (index: number) => {
    const updatedImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(updatedImages);
    onImagesChange(updatedImages);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  return (
    <div className="space-y-4 w-full">
      {/* Área de Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer ${
          isDragActive ? "border-redBright bg-red-50" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-gray-600">
          {isDragActive
            ? "Solte suas imagens aqui..."
            : "Arraste suas imagens ou clique para selecionar"}
        </p>
        <button
          type="button"
          className="mt-2 inline-block bg-redDark text-white px-4 py-2 rounded hover:bg-redBright"
        >
          Selecionar Imagens
        </button>
      </div>

      {/* Pré-visualização das imagens */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {uploadedImages.map((image, index) => (
            <div
              key={index}
              className="relative border rounded overflow-hidden group"
            >
              <img
                src={URL.createObjectURL(image)}
                alt={`Upload Preview ${index}`}
                className="w-full h-32 object-cover"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 text-sm hover:bg-red-700"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
