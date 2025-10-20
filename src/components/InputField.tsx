import React from "react";
import InputMask from "react-input-mask";
import { InputFieldProps } from "../types";

const InputField: React.FC<InputFieldProps> = ({
  label,
  type = "text",
  name,
  value,
  placeholder,
  onChange,
  onBlur, // <-- agora aceitamos onBlur
  required = false,
  mask,
  className = "mt-1 p-2 w-full border border-gray-300 rounded-md",
  containerClassName,
  ...rest // <-- passa qualquer outra prop nativa (ex.: autoComplete, inputMode)
}) => {
  return (
    <div className={containerClassName}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      {mask ? (
        <InputMask
          mask={mask}
          value={value}
          onChange={onChange}
          onBlur={onBlur} // <-- repassa onBlur para o InputMask
        >
          {(inputProps: any) => (
            <input
              {...inputProps} // inclui handlers do InputMask
              id={name}
              name={name}
              type={type}
              placeholder={placeholder}
              className={className}
              required={required}
              {...rest} // inclui handlers/props extras vindos do componente pai
            />
          )}
        </InputMask>
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur} // <-- repassa onBlur no input “normal”
          className={className}
          required={required}
          {...rest}
        />
      )}
    </div>
  );
};

export default InputField;
