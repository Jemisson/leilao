import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: number;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Verifica se o usuário está autenticado ao carregar o app
  const checkAuth = async () => {
    try {
      const response = await fetch("http://localhost:3000/auth/check", {
        method: "GET",
        credentials: "include", // Garante que os cookies são enviados
      });

      if (!response.ok) throw new Error("Não autenticado");

      const data = await response.json();
      setUser(data.user);
      setIsAuthenticated(true);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Login do usuário
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Garante envio e recebimento dos cookies
        body: JSON.stringify({ user: { email, password } }),
      });

      if (!response.ok) throw new Error("Credenciais inválidas");

      const data = await response.json();
      setUser(data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  };

  // Logout do usuário
  const logout = async () => {
    try {
      await fetch("http://localhost:3000/logout", {
        method: "POST",
        credentials: "include", // Garante envio do cookie
      });
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  useEffect(() => {
    checkAuth(); // Verifica a autenticação ao carregar o app
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext) as AuthContextType;
