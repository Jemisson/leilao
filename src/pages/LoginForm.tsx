import { useGoogleLogin } from "@react-oauth/google";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Logo from "../components/Logo";
import { googleLogin, login } from "../services/api";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await googleLogin(tokenResponse.access_token);
        
        if (response.message === "Usuário não cadastrado"){
          navigate("/participantes/new", {
            state: { email: response.user.email, name: response.user.name },
          });

          toast.warning("Você precisa completar o cadastro para continuar!", {
            autoClose: 15000,
          });
        } else {
          Cookies.set("leilao_jwt_token", response.token, { expires: 5 });
          if (response.role === "admin") {
            navigate("/dashboard");
          } else {
            navigate("/");
          }
          toast.success("Autenticado com sucesso via Google!");
        }
      } catch (err) {
        toast.error(`Erro ao autenticar com Google: ${err}`);
      }
    },
    onError: () => {
      toast.error("Falha no login com Google");
    }
  });

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
      <div className="w-full lg:w-1/2 relative bg-redDark text-white flex flex-col justify-center items-center p-6">
        
        <h1 className="text-4xl font-bold mt-6 text-center">Bem-vindo(a) à plataforma de leilões Virtuais!</h1>
        <p className="mt-4 text-lg text-center">
          Aqui você encontra as melhores oportunidades para comprar itens exclusivos.
        </p>
        <p>Participe de leilões de forma prática e segura!</p>
        <p className="mt-6 text-center">Entre em contato para automatizar o seu leilão!</p>
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/gado.jpg')" }}
        ></div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-gray-50 p-6">
        <Logo colorText="text-black"/>
        <h3 className="mt-5 mb-3 text-2xl text-gray-900">Autentique-se com uma das opções abaixo</h3>

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

        <a
          onClick={() => handleGoogleLogin()}
          className="flex items-center justify-center w-full py-4 mb-6 text-sm font-medium transition duration-300 rounded-2xl text-gray-900 bg-gray-300 hover:bg-gray-400 focus:ring-4 focus:ring-gray-300 cursor-pointer"
        >
          <img className="h-5 mr-2" src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/motion-tailwind/img/logos/logo-google.png" alt="Google Logo" />
          Entrar com Google
        </a>

          <div className="flex items-center mb-3 w-full">
            <hr className="h-0 border-b border-solid border-gray-500 grow" />
            <p className="mx-4 text-gray-600">ou</p>
            <hr className="h-0 border-b border-solid border-gray-500 grow" />
          </div>

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
          <input
            id="password"
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="flex items-center w-full px-5 py-4 mb-5 text-sm font-medium outline-none focus:bg-gray-400 placeholder:text-gray-700 bg-gray-200 text-gray-900 rounded-2xl"
          />
    
          <button
            type="submit"
            className="w-full px-6 py-5 mb-5 text-sm font-bold leading-none text-white transition duration-300 rounded-2xl !bg-redDark hover:!bg-redBright focus:!ring-4 focus:!ring-redBright"
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
