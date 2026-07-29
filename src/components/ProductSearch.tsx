import { useEffect, useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

interface ProductSearchProps {
  onSearch: (query: string) => void;
  onClear?: () => void;
  defaultValue?: string;
}

const ProductSearch = ({ onSearch, onClear, defaultValue = ""  }: ProductSearchProps) => {
  const [query, setQuery] = useState(defaultValue)

  useEffect(() => {
    setQuery(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    const trimmed = query.trim();

    if (trimmed.length >= 2) {
      const timeoutId = window.setTimeout(() => {
        onSearch(trimmed);
      }, 300);

      return () => window.clearTimeout(timeoutId);
    }

    if (trimmed.length < 2 && defaultValue) {
      onClear?.();
    }
  }, [defaultValue, onClear, onSearch, query]);

  return (
    <div className="flex w-full max-w-3xl">
      <div className="relative flex-1">
        <FaSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-12 w-full rounded-md border border-gray-200 bg-white pl-11 pr-12 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-pinkDark"
          placeholder="Buscar por produto, lote, descrição ou valor..."
        />
        {query && onClear && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              onClear();
            }}
            className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-pinkDark"
            aria-label="Limpar busca"
            title="Limpar busca"
          >
            <FaTimes className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductSearch;
