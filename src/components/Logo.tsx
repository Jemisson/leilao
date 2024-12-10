import coracao from '../assets/images/logo_coracao.png'

function Logo() {
  return (
    <div className="flex items-center">
      <img
        src={coracao}
        alt="Logo Imagem Peregrina"
        className="h-9 w-18"
      />
      <span className="text-2xl font-semibold whitespace-nowrap text-beige">
        Leilões Virtuais
      </span>
    </div>
  );
};

export default Logo;
