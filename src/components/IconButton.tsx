import React from "react";
import { IconButtonProps } from "../types";

const IconButton: React.FC<IconButtonProps> = ({ onClick, icon, ariaLabel, className }) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 ${className}`}
      aria-label={ariaLabel}
    >
      {icon}
    </button>
  );
};

export default IconButton;
