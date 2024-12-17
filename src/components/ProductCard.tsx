import { Product } from "../types";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div
      className="relative max-w-sm bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700"
      key={product.id}
    >
      {/* Imagem do Produto */}
      <div className="relative">
        <img
          className="rounded-t-lg w-full h-48 object-cover"
          src="/public/empty.png"
          alt={product.attributes.name}
        />

        {/* Tag da Categoria */}
        <span className="absolute bottom-2 right-2 bg-redDark text-beige text-xs font-semibold px-2 py-1 rounded-lg shadow">
          {product.attributes.category_title}
        </span>
      </div>

      {/* Conteúdo do Card */}
      <div className="p-5">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {product.attributes.name}
        </h5>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {product.attributes.description}
        </p>
        <p className="mb-3 font-semibold text-lg text-gray-900 dark:text-white">
          Valor: R$ {product.attributes.winning_value}
        </p>
        <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-redBright rounded-lg hover:bg-redDark focus:ring-4 focus:outline-none focus:ring-redBright dark:bg-redBright dark:hover:bg-redDark dark:focus:ring-redBright">
          Fazer um Lance
          <svg
            className="w-4 h-4 ml-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 9l-5 5-5-5" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
