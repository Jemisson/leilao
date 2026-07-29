import React, { useEffect, useRef, useState } from "react";
import { AuctionModalProps, MarkAsSoldPayload } from "../types";
import { formatCurrency } from "../utils/currency";

const inputClassName = "h-11 w-full rounded-md border border-gray-300 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-redBright";

const onlyDigits = (value: string) => value.replace(/\D/g, "");

const formatPhone = (value: string) => {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const formatCurrencyInput = (value: string) => {
  const cents = Number(onlyDigits(value));
  return formatCurrency(cents / 100);
};

const parseCurrencyInput = (value: string) => Number(onlyDigits(value)) / 100;

const formatInitialCurrency = (value?: number) => {
  if (value === undefined || Number.isNaN(value)) return "";
  return formatCurrency(value);
};

const AuctionModal: React.FC<AuctionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  lotNumber,
  currentValue,
  showCurrentValue = true,
  initialData = {},
  mode = "create",
}) => {
  const [bidderName, setBidderName] = useState("");
  const [bidderPhone, setBidderPhone] = useState("");
  const [winningValue, setWinningValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const winningValueInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    setBidderName(initialData.bidder_name || "");
    setBidderPhone(initialData.bidder_phone ? formatPhone(initialData.bidder_phone) : "");
    setWinningValue(formatInitialCurrency(initialData.winning_value));
    setIsSubmitting(false);
    window.setTimeout(() => winningValueInputRef.current?.focus(), 0);
  }, [initialData.bidder_name, initialData.bidder_phone, initialData.winning_value, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const payload: MarkAsSoldPayload = {
      bidder_name: bidderName.trim(),
      bidder_phone: bidderPhone.trim(),
      winning_value: parseCurrencyInput(winningValue),
    };

    setIsSubmitting(true);

    try {
      await onConfirm(payload);
    } finally {
      setIsSubmitting(false);
    }
  };
 
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-redDark">
            {mode === "edit" ? "Editar Arremate" : "Confirmar Arremate"}
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            {mode === "edit" ? "Atualize" : "Informe"} os dados do comprador para o lote <strong>{lotNumber}</strong>.
          </p>
          {showCurrentValue && currentValue !== undefined && (
            <p className="mt-3 rounded-md bg-blueBright/10 px-3 py-2 text-sm font-semibold text-blueBright">
              Valor atual: {formatCurrency(Number(currentValue))}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="bidder_name" className="mb-2 block text-sm font-semibold text-gray-700">
              Nome do comprador
            </label>
            <input
              id="bidder_name"
              type="text"
              value={bidderName}
              onChange={(event) => setBidderName(event.target.value)}
              className={inputClassName}
              placeholder="Nome completo"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="bidder_phone" className="mb-2 block text-sm font-semibold text-gray-700">
              Telefone do comprador
            </label>
            <input
              id="bidder_phone"
              type="tel"
              value={bidderPhone}
              onChange={(event) => setBidderPhone(formatPhone(event.target.value))}
              className={inputClassName}
              placeholder="(67) 99999-9999"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="winning_value" className="mb-2 block text-sm font-semibold text-gray-700">
              Valor de arremate
            </label>
            <input
              id="winning_value"
              ref={winningValueInputRef}
              type="text"
              inputMode="decimal"
              value={winningValue}
              onChange={(event) => setWinningValue(formatCurrencyInput(event.target.value))}
              className={inputClassName}
              placeholder="R$ 0,00"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-gray-200 px-4 py-2 font-semibold text-gray-700 transition hover:bg-gray-300"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="rounded-md border border-blueBright !bg-blueBright px-4 py-2 font-semibold !text-white shadow-sm transition hover:border-pinkDark hover:!bg-pinkDark disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? mode === "edit" ? "Salvando..." : "Arrematando..."
              : mode === "edit" ? "Salvar arremate" : "Confirmar arremate"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuctionModal;
