import React from "react";
import { AuctionModalProps } from "../types";

const AuctionModal: React.FC<AuctionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  lotNumber,
  currentValue,
  winning_name,
}) => {
  if (!isOpen) return null;
 
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-bold mb-4 text-redDark">Confirmar Arremate</h2>
        <p className="text-2xl"><strong>{winning_name}</strong> vai arrematar</p>
        <p className="text-2xl">Lote <strong>{lotNumber}</strong> {" "} por R$ <strong>{currentValue}</strong> </p>
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2 hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="bg-redDark text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuctionModal;
