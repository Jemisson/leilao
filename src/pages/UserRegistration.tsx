import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UserForm from "../components/UserForm";
import { createUser } from "../services/api";
import { ProfileUser } from "../types";
import { getUserRole } from "../utils/authHelpers";

const UserRegistration: React.FC = () => {
  const location = useLocation();
  const userFromGoogle = location.state || {};

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const currentUserRole = getUserRole() || "user";

  const handleSubmit = async (profileUser: ProfileUser) => {
    setIsSubmitting(true);
    try {
      await createUser(profileUser);
      navigate("/dashboard/participantes");
      toast.success("Cadastro realizado com sucesso!");
    } catch (err) {
      toast.error(`Erro ao cadastrar usuário: ${err}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Cadastro de Usuário</h1>
      <UserForm
        initialProfileUser={{
          name: userFromGoogle.name || "",
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
            email: userFromGoogle.email || "",
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
