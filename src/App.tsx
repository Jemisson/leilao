import { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { WebSocketProvider } from "./contexts/WebSocketProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Footer from "./components/Footer";

function App() {
  const CLIENT_ID = "278675836812-upp77kl8ioiea5sdv5pc490flvvhpik3.apps.googleusercontent.com";
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <WebSocketProvider>
        <Router>
          <ToastContainer />

          <div className="flex flex-col min-h-screen bg-gray-100">
            <Navbar
              activeCategory={selectedCategory}
              onCategoryClick={handleCategoryClick}
            />

            <AppRoutes
              selectedCategory={selectedCategory}
            />

            <Footer />
          </div>
        </Router>
      </WebSocketProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
