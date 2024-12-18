import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import Cookies from "js-cookie";
import { AxiosError } from "axios";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login(email, password);

      // Armazena o token JWT nos cookies
      Cookies.set("leilao_jwt_token", data.token, { expires: 5 });

      setMessage(data.message || "Login realizado com sucesso!");
      
      // Redireciona o usuário para o Dashboard
      navigate("/dashboard");
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response && axiosError.response.data) {
        setMessage((axiosError.response.data as { message?: string }).message || "Erro ao realizar login.");
      } else {
        setMessage("Erro de conexão com o servidor.");
      }
    }
  };

  return (
    <div className="login-container mt-12">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
          />
        </div>
        <div>
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
        </div>
        <button type="submit" className="login-button">
          Entrar
        </button>
      </form>
      {message && <p className="login-message">{message}</p>}
    </div>
  );
};

export default LoginForm;
