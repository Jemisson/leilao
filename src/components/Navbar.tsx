import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchCategories } from "../services/api";
import Logo from "./Logo";
import { Category, NavBarProps } from "../types";
import { isAuthenticated } from "../utils/authHelpers";
import Cookies from "js-cookie";

function Navbar({ onCategoryClick, activeCategory }: NavBarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [pendingCategory, setPendingCategory] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = isAuthenticated();

    const shouldShowNavbar = location.pathname !== "/login";

    useEffect(() => {
      const handleScroll = () => {
        const currentScrollY = window.scrollY;
  
        if (currentScrollY > lastScrollY) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
  
        setLastScrollY(currentScrollY);
      };
  
      window.addEventListener("scroll", handleScroll);
  
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, [lastScrollY]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data.data);
      } catch (error) {
        console.error("Erro ao carregar categorias", error);
      }
    };

    getCategories();
  }, []);

  useEffect(() => {
    if (location.pathname === "/" && pendingCategory !== null) {
      onCategoryClick(pendingCategory);
      setPendingCategory(null);
    }
  }, [location.pathname, pendingCategory, onCategoryClick]);

  const handleCategoryClick = (categoryId: string | null) => {
    if (location.pathname !== "/") {
      setPendingCategory(categoryId);
      navigate("/", { replace: true });
    } else {
      onCategoryClick(categoryId);
    }
  };

  const handleLogout = () => {
    Cookies.remove("leilao_jwt_token");
    navigate("/login");
  };

  if (!shouldShowNavbar) return null;

  return (
    <nav
      className={`bg-redDark border-gold sticky top-0 left-0 w-full z-50 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } transition-transform duration-300`}
    >
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="flex items-center space-x-2 sm:ml-0 ml-12">
          <Logo />
        </div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-gold rounded-lg md:hidden hover:bg-redBright focus:outline-none focus:ring-2 focus:ring-gold"
          aria-controls="navbar-default"
          aria-expanded={isMenuOpen}
        >
          <span className="sr-only">Abrir menu</span>
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
            aria-hidden="true"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
  
        {/* Menu responsivo */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } w-full md:block md:w-auto`}
          id="navbar-default"
        >
          <ul className="flex flex-col md:flex-row md:space-x-4 items-center">
            {categories.map((category) => (
              <li key={category.id}>
                <button
                  className={`px-3 py-2 text-beige ${
                    activeCategory === category.id
                      ? "border-b-2 border-gold text-gold"
                      : "hover:text-gold hover:border-b-2 hover:border-gold"
                  }`}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  {category.attributes.title}
                </button>
              </li>
            ))}
            <li>
              <button
                className={`px-3 py-2 text-beige ${
                  activeCategory === null && location.pathname === "/"
                    ? "border-b-2 border-gold text-gold"
                    : "hover:text-gold hover:border-b-2 hover:border-gold"
                }`}
                onClick={() => handleCategoryClick(null)}
              >
                Ver Tudo
              </button>
            </li>
  
            {isLoggedIn ? (
              <>
                <li>
                  <button
                    className="px-3 py-2 text-beige hover:text-gold hover:border-b-2 hover:border-gold"
                    onClick={handleLogout}
                  >
                    Sair
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button
                  className="px-3 py-2 text-beige hover:text-gold hover:border-b-2 hover:border-gold"
                  onClick={() => navigate("/login")}
                >
                  Entrar
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
  
}

export default Navbar;
