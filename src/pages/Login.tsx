import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const { login } = useAuth(); // Função de login do contexto
  const navigate = useNavigate();

  // Estados do formulário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Chama a função de login do contexto
      await login(email, password);

      // Redireciona o usuário para a área administrativa
      navigate("/admin");
    } catch (err) {
      console.error("Erro no login:", err);
      setError("Falha no login. Verifique suas credenciais.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {/* Título */}
      <h2 className="text-3xl font-bold mb-6 text-redDark">Área Administrativa</h2>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-6 rounded shadow-md">
        {/* Campo Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-redBright"
            placeholder="Digite seu email"
            required
          />
        </div>

        {/* Campo Senha */}
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
            Senha
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-redBright"
            placeholder="Digite sua senha"
            required
          />
        </div>

        {/* Mensagem de Erro */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Botão de Login */}
        <button
          type="submit"
          className="w-full bg-redBright text-white py-2 px-4 rounded hover:bg-redDark transition-all duration-200"
        >
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;
