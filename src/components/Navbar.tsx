import React, { useEffect, useState } from "react";
import { fetchCategories } from "../services/categories";
import Logo from "./Logo";

type Category = {
  id: string;
  attributes: {
    title: string;
  };
};

const Navbar: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);

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

  return (
    <nav className="bg-redDark border-gold">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">

        <Logo />

        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-gold rounded-lg md:hidden hover:bg-redBright focus:outline-none focus:ring-2 focus:ring-gold"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="sr-only">Abrir menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
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
        {/* Menu */}
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gold rounded-lg bg-redDark md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-redDark">
            {categories.map((category) => (
              <li key={category.id}>
                <a
                  href="#"
                  className="block py-2 px-3 text-beige bg-redBright rounded md:bg-transparent md:text-beige md:p-0 hover:text-gold"
                  aria-current="page"
                >
                  {category.attributes.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
