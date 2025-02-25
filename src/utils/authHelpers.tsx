import Cookies from "js-cookie";

export const getToken = (): string | undefined => {
  return Cookies.get("leilao_jwt_token");
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const getUserRole = (): string | null => {
  const token = Cookies.get("leilao_jwt_token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role || null;
  } catch (err) {
    console.error("Erro ao decodificar token:", err);
    return null;
  }
};

export const getAuthenticatedUser = (): { id: number; role: string, name: string } | null => {
  const token = Cookies.get("leilao_jwt_token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      id: payload.id,
      role: payload.role,
      name: payload.name
    };
  } catch (err) {
    console.error("Erro ao decodificar token:", err);
    return null;
  }
};
