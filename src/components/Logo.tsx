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
    <div className="flex h-12 min-w-0 cursor-pointer items-center space-x-2" onClick={handleClick}>
      <img
        src={logo}
        alt="Logo Imagem Peregrina"
        className="h-full shrink-0 object-contain"
      />
      <span className={`max-w-[52vw] truncate text-sm font-semibold whitespace-nowrap sm:max-w-[44vw] sm:text-lg lg:max-w-none lg:text-2xl ${colorText}`}>
        23° LEILÃO DIREITO DE VIVER
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
