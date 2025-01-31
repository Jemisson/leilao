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
    const payload = JSON.parse(atob(token.split(".")[1])); // Decodifica o payload do JWT
    return payload.role || null; // Retorna a role do usuário, assumindo que está no token
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
    return null;
  }
};
