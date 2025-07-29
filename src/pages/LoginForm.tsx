import { AxiosError } from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Logo from "../components/Logo";
import { login } from "../services/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login(email, password);

      const payload = JSON.parse(atob(data.token.split(".")[1]));
      const userRole = payload.role;

      if (userRole === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }

      setMessage(data.message || "Login realizado com sucesso!");
      toast.success("Autenticado com sucesso");
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response && axiosError.response.data) {
        setMessage((axiosError.response.data as { message?: string }).message || "Erro ao realizar login.");
      } else {
        setMessage("Erro de conexão com o servidor.");
        toast.error(`Erro de conexão com o servidor: ${error}`);
      }
    }
  };

  const handleCreateAccountClick = () => {
    navigate('/participantes/new');
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <div className="w-full lg:w-1/2 relative bg-blueBright text-white flex flex-col justify-center items-center p-6">
        
        <h1 className="text-4xl font-bold mt-6 text-center">Bem-vindo(a) à plataforma de leilões Virtuais!</h1>
        <p className="mt-4 text-lg text-center">
          Aqui você encontra as melhores oportunidades para comprar itens exclusivos.
        </p>
        <p>Participe de leilões de forma prática e segura!</p>
        <p className="mt-6 text-center">Entre em contato para automatizar o seu leilão!</p>
        <p className="mt-6 text-center">(67) 9 9861-5428</p>
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/hospital_de_amor.jpg')" }}
        ></div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-gray-50 p-6">
        <Logo colorText="text-blueBright"/>

        {message && (
          <p
            className={`mb-4 text-sm font-medium ${
              message.includes("sucesso") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <form
          onSubmit={handleLogin}
          className="flex flex-col items-center w-2/3"
        >

          <label htmlFor="email" className="mb-2 text-sm text-start text-gray-900 w-full">
            Email*
          </label>
          <input
            id="email"
            type="email"
            placeholder="mail@leilao.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex items-center w-full px-5 py-4 mb-7 text-sm font-medium outline-none focus:bg-gray-400 placeholder:text-gray-700 bg-gray-200 text-gray-900 rounded-2xl"
          />

          <label htmlFor="password" className="mb-2 text-sm text-start text-gray-900 w-full">
            Senha*
          </label>
          <div className="relative w-full mb-5">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="flex items-center w-full px-5 py-4 text-sm font-medium outline-none focus:bg-gray-400 placeholder:text-gray-700 bg-gray-200 text-gray-900 rounded-2xl pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-600 focus:outline-none"
              title={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full px-6 py-5 mb-5 text-sm font-bold leading-none text-white transition duration-300 rounded-2xl !bg-pinkDark hover:!bg-blueBright focus:!ring-4 focus:!ring-blueBright"
          >
            Entrar
          </button>
        </form>
    
        <p className="text-sm leading-relaxed text-gray-900 w-2/3 text-center">
          Primeira vez aqui?{" "}
          <button
            onClick={handleCreateAccountClick}
            className="font-bold text-blue-700 hover:underline focus:outline-none"
          >
            Crie uma conta agora
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
