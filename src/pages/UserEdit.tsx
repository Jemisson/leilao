import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchUserById, updateUser } from "../services/api";
import { ProfileUser } from "../types";
import UserForm from "../components/UserForm";
import { getUserRole } from "../utils/authHelpers";

const UserEdit: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const currentUserRole = getUserRole() || "user";

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const response = await fetchUserById(Number(userId));
        setProfileUser({
          ...response.data.attributes,
          user_attributes: response.data.attributes.user_attributes
        });
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      getUserDetails();
    }
  }, [userId]);

  const handleSubmit = async (updatedProfileUser: ProfileUser) => {
    setIsSubmitting(true);
    try {
      await updateUser(Number(userId), updatedProfileUser);
      navigate("/dashboard/licitantes");
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p className="p-6">Carregando...</p>;
  if (!profileUser) return <p className="p-6 text-red-500">Usuário não encontrado.</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Editar Usuário</h1>
      <UserForm
        initialProfileUser={profileUser}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        currentUserRole={currentUserRole}
      />
    </div>
  );
};

export default UserEdit;
