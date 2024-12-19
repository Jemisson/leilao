import { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  return (
    <Router>
      <>
        {/* Navbar visível em todas as páginas */}
        <Navbar
          activeCategory={selectedCategory}
          onCategoryClick={handleCategoryClick}
        />

        {/* Rotas da aplicação */}
        <AppRoutes
          selectedCategory={selectedCategory}
          onCategoryClick={handleCategoryClick}
        />
      </>
    </Router>
  );
}

export default App;
