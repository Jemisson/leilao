import React from "react";
import { parseISO, format } from "date-fns";
import { BidTableProps } from "../types";

const BidTable: React.FC<BidTableProps> = ({ showLotNumber = false, bids }) => {
  const formatDate = (isoDate: string): string => {
    const parsedDate = parseISO(isoDate);
    return format(parsedDate, "dd/MM/yyyy - HH:mm");
  };

  return (
    <div>
      {bids.length > 0 ? (
        <>
          <table className="min-w-full bg-white border border-gray-300 shadow-sm rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">ID</th>
                {showLotNumber && <th className="py-2 px-4 border-b">Número do Lote</th>}
                <th className="py-2 px-4 border-b">Data</th>
                <th className="py-2 px-4 border-b">Nome do Licitante</th>
                <th className="py-2 px-4 border-b">Telefone</th>
                <th className="py-2 px-4 border-b">Valor do Lance</th>
              </tr>
            </thead>
            <tbody>
              {bids.map((bid) => (
                <tr key={bid.id}>
                  <td className="py-2 px-4 border-b text-center">{bid.attributes.id}</td>
                  {showLotNumber && (
                    <td className="py-2 px-4 border-b text-center">{bid.attributes.lot_number}</td>
                  )}
                  <td className="py-2 px-4 border-b text-center">
                    {formatDate(bid.attributes.created_at)}
                  </td>
                  <td className="py-2 px-4 border-b text-center">{bid.attributes.name}</td>
                  <td className="py-2 px-4 border-b text-center">{bid.attributes.phone}</td>
                  <td className="py-2 px-4 border-b text-center">
                    R$ {Number(bid.attributes.value).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p className="text-gray-700 italic">Nenhum lance registrado.</p>
      )}
    </div>
  );
};

export default BidTable;
