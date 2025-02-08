import React, { useState } from "react";
import { createUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import { ProfileUser, UserAttributes } from "../types";
import InputField from "../components/InputField";
import SelectField from "../components/SelectField";
import { getUserRole } from "../utils/authHelpers";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Button from "../components/Button";

const UserRegistration: React.FC = () => {
  const [userAttributes, setUserAttributes] = useState<UserAttributes>({
    email: "",
    role: "user",
    password: "",
  });

  const [profileUser, setProfileUser] = useState<ProfileUser>({
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
    user_attributes: userAttributes,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const currentUserRole = getUserRole();
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "email" || name === "role" || name === "password") {
      setUserAttributes((prev) => ({ ...prev, [name]: value }));
    } else {
      setProfileUser((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createUser(userAttributes);
      navigate("/dashboard/licitantes");
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Cadastro de Usuário</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Dados do Usuário</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Email"
            type="email"
            name="email"
            value={userAttributes.email}
            onChange={handleChange}
            required
          />

          <div className="relative">
            <InputField
              label="Senha"
              type={showPassword ? "text" : "password"}
              name="password"
              value={userAttributes.password || ""}
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
              value={userAttributes.role}
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
    </div>
  );
};

export default UserRegistration;
