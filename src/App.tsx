import { useState } from "react";
import Navbar from "./components/Navbar";
import ProductCatalog from "./components/ProductCatalog";

function App () {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  return (
    <>
       <Navbar onCategoryClick={handleCategoryClick} />
       <ProductCatalog selectedCategory={selectedCategory} />
    </>
  );
};

export default App;
