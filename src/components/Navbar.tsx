import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchCategories } from "../services/api";
import Logo from "./Logo";
import { Category } from "../types";
import { isAuthenticated } from "../utils/authHelpers";
import Cookies from "js-cookie";

interface NavBarProps {
  onCategoryClick: (categoryId: string | null) => void;
  activeCategory: string | null;
}

function Navbar({ onCategoryClick, activeCategory }: NavBarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [pendingCategory, setPendingCategory] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

    // Oculta a Navbar na página de login
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
    <nav className={`bg-redDark border-gold fixed top-0 left-0 w-full z-50 ${ isVisible ? "translate-y-0" : "-translate-y-full"}`}>
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Logo />

        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="flex space-x-4 items-center">
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
                  activeCategory === null
                    ? "border-b-2 border-gold text-gold"
                    : "hover:text-gold hover:border-b-2 hover:border-gold"
                }`}
                onClick={() => handleCategoryClick(null)}
              >
                Ver Tudo
              </button>
            </li>

            {isAuthenticated() && (
              <>
                <li>
                  <button
                    className="px-3 py-2 text-beige hover:text-gold hover:border-b-2 hover:border-gold"
                    onClick={() => navigate("/dashboard")}
                  >
                    Dashboard
                  </button>
                </li>
                <li>
                  <button
                    className="px-3 py-2 text-beige hover:text-gold hover:border-b-2 hover:border-gold"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
