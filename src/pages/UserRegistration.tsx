import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PageHeader from "../components/PageHeader";
import UserForm from "../components/UserForm";
import { createUser } from "../services/api";
import { ProfileUser } from "../types";
import { getUserRole } from "../utils/authHelpers";
import { FaUsers } from "react-icons/fa";

const UserRegistration: React.FC = () => {

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
      <PageHeader title="Cadastro de Usuário" icon={<FaUsers className="h-5 w-5" />} />
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
