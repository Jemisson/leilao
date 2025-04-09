import React from "react";
import { IconButtonProps } from "../types";

const IconButton: React.FC<IconButtonProps> = ({ onClick, icon, ariaLabel, className }) => {
  return (
    <div className="relative group inline-block">
      <button
        onClick={onClick}
        className={`p-2 ${className}`}
        aria-label={ariaLabel}
      >
        {icon}
      </button>
      {ariaLabel && (
        <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 transform whitespace-nowrap text-xs text-white bg-gray-800 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition duration-200 z-10 pointer-events-none">
          {ariaLabel}
        </span>
      )}
    </div>
  );
};

export default IconButton;
