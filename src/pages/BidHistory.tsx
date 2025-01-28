import React from "react";
import BidTable from "../components/BidTable";

const BidHistory: React.FC = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Histórico de Lances</h1>
      <BidTable showLotNumber={true} />
    </div>
  );
};

export default BidHistory;
