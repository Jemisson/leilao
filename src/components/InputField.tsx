import React from "react";
import InputMask from "react-input-mask";
import { InputFieldProps } from "../types";

const InputField: React.FC<InputFieldProps> = ({ label, type, name, value, placeholder, onChange, required = false, mask }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      

      {mask ? (
        <InputMask mask={mask} value={value} onChange={onChange}>
          {(inputProps) => <input {...inputProps} type={type} name={name} placeholder={placeholder} className="mt-1 p-2 w-full border rounded" required={required} />}
        </InputMask>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          required={required}
        />
      )}
    </div>
  );
};

export default InputField;
