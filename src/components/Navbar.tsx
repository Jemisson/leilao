import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchCategories, getUserInfo } from "../services/api";
import { Category, NavBarProps } from "../types";
import Logo from "./Logo";

function Navbar({ onCategoryClick, activeCategory }: NavBarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pendingCategory, setPendingCategory] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const userInfo = getUserInfo();
  const userRole = userInfo?.role;
  const shouldShowNavbar = location.pathname !== "/login";

  // Carrega as categorias
  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data.data);
      } catch (err) {
        toast.error(`Erro ao carregar categorias: ${err}`);
        setCategories([]);
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

  if (!shouldShowNavbar) return null;

  const menuItems = (
    <>
      {categories?.map((category) => (
        <li key={category.id} className="shrink-0">
          <button
            className={`w-full px-3 py-2 text-left text-sm font-semibold text-beige transition md:w-auto md:text-center ${
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
      <li className="shrink-0">
        <button
          className={`w-full px-3 py-2 text-left text-sm font-semibold text-beige transition md:w-auto md:text-center ${
            activeCategory === null && location.pathname === "/"
              ? "border-b-2 border-gold text-gold"
              : "hover:text-gold hover:border-b-2 hover:border-gold"
          }`}
          onClick={() => handleMenuItemClick(null)}
        >
          Ver Tudo
        </button>
      </li>

      {userRole === "admin" && (
        <li className="shrink-0">
          <button
            onClick={() => {
              navigate("/dashboard");
              if (window.innerWidth < 768) setIsMenuOpen(false);
            }}
            className="w-full px-3 py-2 text-left text-sm font-semibold text-beige transition hover:text-gold hover:border-b-2 hover:border-gold md:w-auto md:text-center"
          >
            Dashboard
          </button>
        </li>
      )}

      {userInfo && (
        <li className="shrink-0">
          <button
            className="w-full px-3 py-2 text-left text-sm font-semibold text-beige transition hover:text-gold hover:border-b-2 hover:border-gold md:w-auto md:text-center"
            onClick={handleLogout}
          >
            Sair
          </button>
        </li>
      )}
    </>
  );

  return (
    <nav className="sticky left-0 top-0 z-50 h-20 w-full border-t-8 border-pinkDark bg-blueBright">
      <div className="mx-auto flex h-full w-[90%] items-center justify-between gap-6">
        <div className="flex min-w-0 shrink-0 items-center">
          <Logo onCategoryClick={handleCategoryClick} />
        </div>

        <div className="hidden min-w-0 flex-1 justify-end md:flex">
          <ul className="flex max-w-full items-center justify-end gap-1 overflow-x-auto whitespace-nowrap">
            {menuItems}
          </ul>
        </div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg p-2 text-white hover:bg-pinkDark focus:outline-none focus:ring-2 focus:ring-white md:hidden"
          aria-controls="navbar-mobile"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <FaTimes className="h-5 w-5" /> : <FaBars className="h-5 w-5" />}
        </button>
      </div>

      {isMenuOpen && (
        <div id="navbar-mobile" className="absolute left-0 top-20 w-full bg-blueBright shadow-md md:hidden">
          <ul className="mx-auto flex max-h-[calc(100vh-5rem)] w-[90%] flex-col overflow-y-auto py-3">
            {menuItems}
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
