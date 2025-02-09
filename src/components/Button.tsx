import React from "react";

interface ButtonProps {
  text: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>) => void;
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, className, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 bg-redDark text-white rounded-lg hover:bg-redBright transition ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;
