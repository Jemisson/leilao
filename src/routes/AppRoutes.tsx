import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProductCatalog from "../components/ProductCatalog";
import DashboardLayout from "../components/DashboardLayout";
import LoginForm from "../pages/LoginForm";
import ProductManagement from "../pages/ProductManagement";
import { getAuthenticatedUser, isAuthenticated } from "../utils/authHelpers";
import ProductCreation from "../pages/ProductCreation";
import BidHistory from "../pages/BidHistory";
import ProductEdit from "../pages/ProductEdit";
import ProductDetails from "../pages/ProductDetails";
import Dashboard from "../pages/Dashboard";
import UserManagement from "../pages/UserManagement";
import UserDetails from "../pages/UserDetails";
import UserRegistration from "../pages/UserRegistration";
import UserEdit from "../pages/UserEdit";
import ConditionalLayout from "../components/ConditionalLayout";

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

interface AppRoutesProps {
  selectedCategory: string | null;
}

const AppRoutes: React.FC<AppRoutesProps> = ({ selectedCategory }) => {
  const user = getAuthenticatedUser();
  const profileUserId = user ? user.id : null;

  return (
    <Routes>
      {/* Página inicial pública */}
      <Route
        path="/"
        element={
          <ProductCatalog
            selectedCategory={selectedCategory}
            profileUserId={profileUserId}
          />
        }
      />

      {/* Página de login */}
      <Route path="/login" element={<LoginForm />} />
      <Route element={<ConditionalLayout />}>
        <Route path="licitantes/new" element={<UserRegistration />} />
      </Route>

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
        <Route index element={<Dashboard />} />
        <Route path="historico" element={<BidHistory /> }/>
        <Route path="produtos" element={<ProductManagement />} />
        <Route path="produtos/new" element={<ProductCreation />} />
        <Route path="produtos/:productId/lances" element={ <ProductDetails />} />
        <Route path="produtos/:productId/edit" element={<ProductEdit />} />
        <Route path="licitantes" element={<UserManagement />} />
        <Route path="licitantes/:userId" element={<UserDetails />} />
        <Route path="licitantes/:userId/edit" element={<UserEdit />} />

      </Route>
    </Routes>
  );
};

export default AppRoutes;
