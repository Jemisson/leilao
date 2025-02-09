import { Link } from 'react-router-dom';
import coracao from '../assets/images/logo_coracao.png'
interface LogoProps {
  onCategoryClick?: (categoryId: string | null) => void;
  isLink?: boolean;
}

function Logo({ onCategoryClick, isLink = true }: LogoProps) {
  const handleClick = () => {
    if (onCategoryClick) {
      onCategoryClick(null);
    }
  };

  const content = (
    <div className="flex items-center space-x-2" onClick={handleClick}>
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


  return isLink ? (
    <Link to="/">
      {content}
    </Link>
  ) : (
    content
  );
};

export default Logo;
