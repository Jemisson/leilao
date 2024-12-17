import { useState } from "react";
import Navbar from "./components/Navbar";
import ProductCatalog from "./components/ProductCatalog";

function App () {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  return (
    <>
       <Navbar 
        onCategoryClick={handleCategoryClick}
       activeCategory={selectedCategory} 
      />
       <ProductCatalog selectedCategory={selectedCategory} />
    </>
  );
};

export default App;
