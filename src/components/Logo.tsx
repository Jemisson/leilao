import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";
import logoWhite from "../assets/images/logo-white.png";

type LogoVariant = "original" | "white";

interface LogoProps {
  onCategoryClick?: (categoryId: string | null) => void;
  isLink?: boolean;
  colorText?: string;
  variant?: LogoVariant;              // original | white
  showTextOnMobile?: boolean;         // controla se o texto aparece no mobile
  className?: string;                 // opcional para estilizar o wrapper
}

function Logo({
  onCategoryClick,
  isLink = true,
  colorText = "text-beige",
  variant = "original",
  showTextOnMobile = false,
  className = "",
}: LogoProps) {
  const handleClick = () => onCategoryClick?.(null);
  const selectedLogo = variant === "white" ? logoWhite : logo;

  const content = (
    <div
      className={`flex items-center gap-2 min-w-0 ${className}`}
      onClick={handleClick}
    >
      <img
        src={selectedLogo}
        alt="Logo Imagem Peregrina"
        className="flex-none w-auto h-8 sm:h-10 md:h-12 lg:h-16"
        loading="lazy"
        decoding="async"
        sizes="(min-width: 1024px) 4rem, (min-width: 768px) 3rem, (min-width: 640px) 2.5rem, 2rem"
      />
      <span
        className={[
          showTextOnMobile ? "inline" : "hidden sm:inline",
          "truncate font-semibold whitespace-nowrap",
          "text-sm sm:text-base md:text-lg lg:text-2xl",
          colorText,
        ].join(" ")}
        title="Leilão Comunidade São Francisco"
      >
        Leilão Comunidade São Francisco
      </span>
    </div>
  );

  return isLink ? <Link to="/">{content}</Link> : content;
}

export default Logo;
