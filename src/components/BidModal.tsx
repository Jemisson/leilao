import React, { useState } from "react";
import { BidModalProps } from "../types";
import { createBid } from "../services/api";
import { toast } from "react-toastify";

const BidModal: React.FC<BidModalProps> = ({ 
  isOpen,
  onClose,
  productName,
  productId,
  profileUserId,
  currentValue,
 }) => {
  const [bidValue, setBidValue] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    if (!profileUserId) {
      toast.error("Você precisa estar autenticado para fazer um lance.");
      return;
    }

    if (typeof bidValue !== "number" || bidValue <= currentValue) {
      toast.warning("Por favor, insira um valor maior que o valor atual");
      return;
    }

    try {
      await createBid(productId, bidValue, profileUserId);
      onClose();
      toast.success("Lance registrado com sucesso");
    } catch (err: unknown) {
      if (err instanceof Error) {
        if ((err as { status?: number }).status === 401) {
          toast.error("Você precisa estar autenticado para fazer um lance!");
        } else {
          toast.error(`Erro ao efetuar lance: ${err.message}`);
        }
      } else {
        toast.error("Erro desconhecido ao efetuar lance.");
      }
    } finally {
      setBidValue("");
      setLoading(false);
    }
  };

  const handleTagClick = (increment: number) => {
    setBidValue(Number(currentValue) + increment);
  };

  const handleCancel = () => {
    setBidValue("");
    onClose()
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h1 className="text-4xl text-center font-bold mb-4 text-redDark">Lote {productName}</h1>
        <h2 className="text-center font-bold mb-10"> Valor atual: R$ {currentValue}</h2>

        <div className="flex gap-2 mb-4">
          {[10, 20, 50, 100].map((increment) => (
            <button
              key={increment}
              type="button"
              onClick={() => handleTagClick(increment)}
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              +R$ {increment}
            </button>
          ))}
        </div>

        <input
          type="number"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="Informe o valor do lance"
          value={bidValue}
          onChange={(e) => setBidValue(Number(e.target.value))}
        />
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-4 py-2 text-redDark rounded hover:bg-redDark hover:text-white"
            onClick={handleCancel}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="px-4 py-2 !bg-redDark text-white rounded hover:!bg-redBright"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Enviando..." : "Confirmar Lance"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BidModal;
