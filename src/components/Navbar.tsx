import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchCategories, getUserInfo } from "../services/api";
import { Category, NavBarProps } from "../types";
import { isAuthenticated } from "../utils/authHelpers";
import Logo from "./Logo";

function Navbar({ onCategoryClick, activeCategory }: NavBarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [pendingCategory, setPendingCategory] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = isAuthenticated();
  const userInfo = getUserInfo();
  const userId = userInfo?.id;
  const userRole = userInfo?.role;
  const shouldShowNavbar = location.pathname !== "/login";

  // Esconde o navbar ao rolar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY <= lastScrollY);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Carrega as categorias
  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data.data);
      } catch (err) {
        toast.error(`Erro ao carregar categorias: ${err}`);
      }
    };

    getCategories();
  }, []);

  // Aplica a categoria pendente ao navegar para /
  useEffect(() => {
    if (location.pathname === "/" && pendingCategory !== null) {
      onCategoryClick(pendingCategory);
      setPendingCategory(null);
    }
  }, [location.pathname, pendingCategory, onCategoryClick]);

  // Fecha o menu ao mudar de rota (extra)
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMenuOpen(false);
    }
  }, [location.pathname]);

  const handleCategoryClick = (categoryId: string | null) => {
    if (location.pathname !== "/") {
      setPendingCategory(categoryId);
      navigate("/", { replace: true });
    } else {
      onCategoryClick(categoryId);
    }
  };

  const handleMenuItemClick = (categoryId: string | null) => {
    handleCategoryClick(categoryId);
    if (window.innerWidth < 768) {
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove("leilao_jwt_token");
    navigate("/login");
  };

  const handleProfileClick = () => {
    if (userId) {
      navigate(`/dashboard/participantes/${userId}/edit`);
      if (window.innerWidth < 768) setIsMenuOpen(false);
    }
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
          <Logo onCategoryClick={handleCategoryClick} />
        </div>

        {/* Botão menu mobile */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-gold rounded-lg md:hidden hover:bg-redBright focus:outline-none focus:ring-2 focus:ring-gold"
          aria-controls="navbar-default"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
        </button>

        {/* Menu */}
        <div
          id="navbar-default"
          className={`w-full md:w-auto ${
            isMenuOpen ? "block" : "hidden"
          } md:block transition-all duration-300 ease-in-out`}
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
                  onClick={() => handleMenuItemClick(category.id)}
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
                onClick={() => handleMenuItemClick(null)}
              >
                Ver Tudo
              </button>
            </li>

            {isLoggedIn ? (
              <>
                {userRole === "user" ? (
                  <li>
                    <button
                      onClick={handleProfileClick}
                      className="px-3 py-2 text-beige hover:text-gold hover:border-b-2 hover:border-gold"
                    >
                      Meus dados
                    </button>
                  </li>
                ) : (
                  <li>
                    <button
                      onClick={() => {
                        navigate("/dashboard");
                        if (window.innerWidth < 768) setIsMenuOpen(false);
                      }}
                      className="px-3 py-2 text-beige hover:text-gold hover:border-b-2 hover:border-gold"
                    >
                      Dashboard
                    </button>
                  </li>
                )}
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
                  onClick={() => {
                    navigate("/login");
                    if (window.innerWidth < 768) setIsMenuOpen(false);
                  }}
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
