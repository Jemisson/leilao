import React from "react";
import Button from "./Button";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        <p className="mb-4">{message}</p>
        <div className="flex justify-end space-x-4">
          <Button
            text="Cancelar"
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-black"
          />
          <Button
            text="Confirmar"
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600"
          />
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
