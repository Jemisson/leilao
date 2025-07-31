import { Link } from 'react-router-dom';
import logo from '../assets/images/logobola_1.png'
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
    <div className="flex items-center h-12 space-x-2 cursor-pointer" onClick={handleClick}>
      <img
        src={logo}
        alt="Logo Imagem Peregrina"
        className="h-full object-contain"
      />
      <span className={`text-base sm:text-lg md:text-xl lg:text-2xl font-semibold whitespace-nowrap ${colorText}`}>
        22° LEILÃO DIREITO DE VIVER
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
