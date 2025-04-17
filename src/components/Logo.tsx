import { Link } from 'react-router-dom';
import logo from '../assets/images/logo2.png'
interface LogoProps {
  onCategoryClick?: (categoryId: string | null) => void;
  isLink?: boolean;
  colorText?: string
}

function Logo({ onCategoryClick, isLink = true, colorText = "text-beige" }: LogoProps) {
  const handleClick = () => {
    if (onCategoryClick) {
      onCategoryClick(null);
    }
  };

  const content = (
    <div className="flex items-center space-x-2" onClick={handleClick}>
      <img
        src={logo}
        alt="Logo Imagem Peregrina"
        className="h-9 w-18"
      />
      <span className={`text-base sm:text-lg md:text-xl lg:text-2xl font-semibold whitespace-nowrap ${colorText}`}>
        2° leilão das Paróquias
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
