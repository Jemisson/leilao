import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProductCatalog from "../components/ProductCatalog";
import DashboardPage from "../pages/Dashboard";
import LoginForm from "../pages/LoginForm";
import { isAuthenticated } from "../utils/authHelpers";

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

interface AppRoutesProps {
  selectedCategory: string | null;
  onCategoryClick: (categoryId: string | null) => void;
}

const AppRoutes: React.FC<AppRoutesProps> = ({ selectedCategory}) => {
  return (
    <Routes>
      {/* Página inicial pública */}
      <Route
        path="/"
        element={
          <ProductCatalog selectedCategory={selectedCategory} />}
      />

      {/* Página de login */}
      <Route
        path="/login"
        element={
          <LoginForm/>}
      />

      {/* Página protegida (dashboard) */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
