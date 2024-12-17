import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import ProductCatalog from "./components/ProductCatalog";
import Login from "./pages/Login";
import AdminPage from "./pages/AdminPage";

function App() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rota Pública: Página Principal */}
          <Route
            path="/"
            element={
              <>
                <Navbar
                  onCategoryClick={handleCategoryClick}
                  activeCategory={selectedCategory}
                />
                <ProductCatalog selectedCategory={selectedCategory} />
              </>
            }
          />

          {/* Rota Pública: Página de Login */}
          <Route path="/login" element={<Login />} />

          {/* Rota Protegida: Área Administrativa */}
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
