import React from "react";
import { motion } from "framer-motion";
import { formatCurrency } from "../utils/currency";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  isCurrency?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color = "bg-white", isCurrency }) => {
  return (
    <motion.div
      className={`p-5 rounded-2xl shadow-sm border border-gray-200 ${color} flex items-center gap-4`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-redDark">{icon}</div>
      <div>
        <h2 className="text-sm font-medium text-gray-700">{title}</h2>
        <p className="text-xl font-bold text-gray-900">
          {isCurrency && typeof value === "number" ? formatCurrency(value) : value}
          {isCurrency}
        </p>
      </div>
    </motion.div>
  );
};

export default StatCard;
