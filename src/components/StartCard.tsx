import React from "react";
import { motion } from "framer-motion";
import { formatCurrency } from "../utils/currency";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  isCurrency?: boolean;
  compact?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color = "bg-white", isCurrency, compact }) => {
  return (
    <motion.div
      className={`flex items-center rounded-lg border border-gray-200 shadow-sm ${color} ${
        compact ? "min-h-20 gap-3 p-4" : "min-h-28 gap-4 p-5"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div
        className={`flex shrink-0 items-center justify-center rounded-lg bg-blueBright/10 text-blueBright ${
          compact ? "h-10 w-10" : "h-12 w-12"
        }`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <h2 className="text-sm font-semibold text-gray-500">{title}</h2>
        <p className={`mt-1 font-bold text-gray-900 ${compact ? "text-xl" : "text-2xl"}`}>
          {isCurrency && typeof value === "number" ? formatCurrency(value) : value}
        </p>
      </div>
    </motion.div>
  );
};

export default StatCard;
