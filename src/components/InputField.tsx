import React from "react";
import { InputFieldProps } from "../types";

const InputField: React.FC<InputFieldProps> = ({ label, type, name, value, onChange, required = false }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
        required={required}
      />
    </div>
  );
};

export default InputField;
