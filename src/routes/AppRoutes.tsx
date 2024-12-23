import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProductCatalog from "../components/ProductCatalog";
import DashboardLayout from "../components/DashboardLayout";
import LoginForm from "../pages/LoginForm";
import ProductManagement from "../pages/ProductManagement";
import { isAuthenticated } from "../utils/authHelpers";
import ProductCreation from "../pages/ProductCreation";

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

interface AppRoutesProps {
  selectedCategory: string | null;
}

const AppRoutes: React.FC<AppRoutesProps> = ({ selectedCategory }) => {
  return (
    <Routes>
      {/* Página inicial pública */}
      <Route
        path="/"
        element={
          <ProductCatalog selectedCategory={selectedCategory} />
        }
      />

      {/* Página de login */}
      <Route path="/login" element={<LoginForm />} />

      {/* Layout do Dashboard com rotas protegidas */}
      <Route
        path="/dashboard/*"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        {/* Rotas dentro do Dashboard */}
        <Route index element={<h1>Bem-vindo ao Dashboard</h1>} />
        <Route path="produtos" element={<ProductManagement />} />
        <Route path="produtos/new" element={<ProductCreation />} />
        <Route path="pessoas" element={<h1>Gerenciamento de Pessoas</h1>} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
