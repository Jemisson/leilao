import React, { useState } from "react";
import { createUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import { ProfileUser } from "../types";
import { getUserRole } from "../utils/authHelpers";
import UserForm from "../components/UserForm";

const UserRegistration: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const currentUserRole = getUserRole() || "user";

  const handleSubmit = async (profileUser: ProfileUser) => {
    setIsSubmitting(true);
    try {
      await createUser(profileUser);
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
      <UserForm
        initialProfileUser={{
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
          user_attributes: {
            id: "",
            email: "",
            role: "user",
            password: "",
          },
        }}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        currentUserRole={currentUserRole}
      />
    </div>
  );
};

export default UserRegistration;
