import React, { useState } from "react";
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import Button from "../components/Button";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ProfileUser, UserFormProps } from "../types";

const UserForm: React.FC<UserFormProps> = ({
  initialProfileUser = {
    name: "",
    cpf: "",
    birth: "",
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    country: "",
    zip_code: "",
    phone: "",
    user_attributes: { email: "", role: "user", password: "" }
  },
  onSubmit,
  isSubmitting,
  currentUserRole
}) => {
  const [profileUser, setProfileUser] = useState<ProfileUser>(initialProfileUser);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (["email", "role", "password"].includes(name)) {
      setProfileUser((prev) => ({
        ...prev,
        user_attributes: {
          ...prev.user_attributes,
          [name]: value
        }
      }));
    } else {
      setProfileUser((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(profileUser);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Dados do Usuário</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Email"
          type="email"
          name="email"
          value={profileUser.user_attributes.email}
          onChange={handleChange}
          required
        />

        <div className="relative">
          <InputField
            label="Senha"
            type={showPassword ? "text" : "password"}
            name="password"
            value={profileUser.user_attributes.password || ""}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            style={{ transform: "translateY(20%)" }}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {currentUserRole === "admin" ? (
          <SelectField
            label="Perfil"
            name="role"
            value={profileUser.user_attributes.role}
            onChange={handleChange}
            options={[
              { value: "user", label: "Usuário" },
              { value: "admin", label: "Administrador" }
            ]}
          />
        ) : (
          <input type="hidden" name="role" value="user" />
        )}
      </div>

      <h2 className="text-xl font-bold mt-6 mb-4">Dados Pessoais</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Nome" type="text" name="name" value={profileUser.name} onChange={handleChange} required />
        <InputField label="CPF" type="text" name="cpf" value={profileUser.cpf} onChange={handleChange} required />
        <InputField label="Data de Nascimento" type="date" name="birth" value={profileUser.birth} onChange={handleChange} required />
        <InputField label="Telefone" type="text" name="phone" value={profileUser.phone} onChange={handleChange} required />
      </div>

      <h2 className="text-xl font-bold mt-6 mb-4">Endereço</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Rua" type="text" name="street" value={profileUser.street} onChange={handleChange} required />
        <InputField label="Número" type="text" name="number" value={profileUser.number} onChange={handleChange} required />
        <InputField label="Bairro" type="text" name="neighborhood" value={profileUser.neighborhood} onChange={handleChange} required />
        <InputField label="Cidade" type="text" name="city" value={profileUser.city} onChange={handleChange} required />
        <InputField label="Estado" type="text" name="state" value={profileUser.state} onChange={handleChange} required />
        <InputField label="País" type="text" name="country" value={profileUser.country} onChange={handleChange} required />
        <InputField label="CEP" type="text" name="zip_code" value={profileUser.zip_code} onChange={handleChange} required />
      </div>

      <Button
        text="Salvar"
        onClick={(e) => {
          e.preventDefault();
          handleSubmit(e as React.FormEvent<HTMLFormElement>);
        }}
        disabled={isSubmitting}
        className="mt-6"
      />
    </form>
  );
};

export default UserForm;
