import { useEffect, useState } from "react";

interface ProductSearchProps {
  onSearch: (query: string) => void;
  onClear?: () => void;
  defaultValue?: string;
}

const ProductSearch = ({ onSearch, onClear, defaultValue = ""  }: ProductSearchProps) => {
  const [query, setQuery] = useState(defaultValue)

  const handleSubmit = () => {
    const trimmed = query.trim();
    if (trimmed.length >= 2) {
      onSearch(trimmed);
    }
  };

  useEffect(() => {
    setQuery(defaultValue);
  }, [defaultValue]);

  return (
    <div className="w-full max-w-2xl flex items-center gap-2 mb-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pinkDark"
        placeholder="Buscar por lote, descrição ou valor..."
      />
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-pinkDark text-white rounded-md hover:bg-pinkBright transition"
      >
        Buscar
      </button>
      {onClear && (
        <button
          onClick={onClear}
          className="text-sm text-gray-500 hover:underline"
        >
          Limpar
        </button>
      )}
    </div>
  );
};

export default ProductSearch;
