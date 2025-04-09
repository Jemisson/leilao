import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ConditionalLayout from "../components/ConditionalLayout";
import DashboardLayout from "../components/DashboardLayout";
import ProductCatalog from "../components/ProductCatalog";
import BidHistory from "../pages/BidHistory";
import Dashboard from "../pages/Dashboard";
import LoginForm from "../pages/LoginForm";
import ProductCreation from "../pages/ProductCreation";
import ProductDetails from "../pages/ProductDetails";
import ProductEdit from "../pages/ProductEdit";
import ProductManagement from "../pages/ProductManagement";
import UserDetails from "../pages/UserDetails";
import UserEdit from "../pages/UserEdit";
import UserManagement from "../pages/UserManagement";
import UserRegistration from "../pages/UserRegistration";
import { isAuthenticated } from "../utils/authHelpers";

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
          <ProductCatalog
            selectedCategory={selectedCategory}
          />
        }
      />

      {/* Página de login */}
      <Route path="/login" element={<LoginForm />} />
      <Route element={<ConditionalLayout />}>
        <Route path="participantes/new" element={<UserRegistration />} />
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
        <Route path="participantes" element={<UserManagement />} />
        <Route path="participantes/:userId" element={<UserDetails />} />
        <Route path="participantes/:userId/edit" element={<UserEdit />} />

      </Route>
    </Routes>
  );
};

export default AppRoutes;
