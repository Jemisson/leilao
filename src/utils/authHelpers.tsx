import Cookies from "js-cookie";

export const getToken = (): string | undefined => {
  return Cookies.get("leilao_jwt_token");
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};
