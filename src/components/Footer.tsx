import React from "react";
import logo from "../assets/images/logobola.png";

const Footer: React.FC = () => {
  return (
    <footer className="bg-blueBright text-beige pt-6 border-t-8 border-pinkDark">
      <div className="w-full  px-4 py-6 flex flex-col items-center md:flex-row md:justify-center md:gap-20">

        <div className="mb-4 md:mb-0">
          <img src={logo} alt="Logo Bola" className="h-28 w-auto" />
        </div>

        <div className="text-center space-y-2">
          <p className="text-lg font-medium">
            Apoie o Hospital de Amor de Nova Andradina - MS
          </p>
          <p className="text-sm font-bold">
            Feito com <span className="text-red-500"> 🤍 </span> por 
            <a href="http://wa.me/5567998615428" target="_blank" title="Clique para enviar uma mensagem"> Jemison Santos</a>
          </p>
          <p className="text-xs font-bold">
            Para automatizar seu leilão com esta ferramenta e muito mais, entre em contato pelo whatsapp: 
            <a href="http://wa.me/5567998615428" target="_blank" title="Clique para enviar uma mensagem">(67) 9 9861-5428</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
