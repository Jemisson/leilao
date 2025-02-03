import { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { WebSocketProvider } from "./contexts/WebSocketProvider";

function App() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  return (
    <WebSocketProvider>
      <Router>
        <Navbar
          activeCategory={selectedCategory}
          onCategoryClick={handleCategoryClick}
        />

        <AppRoutes
          selectedCategory={selectedCategory}
        />
      </Router>
    </WebSocketProvider>
  );
}

export default App;
