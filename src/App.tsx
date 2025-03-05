import { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { WebSocketProvider } from "./contexts/WebSocketProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  const CLIENT_ID = "278675836812-aa24q86tnv33scefsei4tvkf8rb63pa4.apps.googleusercontent.com";
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };


  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <WebSocketProvider>
        <Router>
          <ToastContainer />
          <Navbar
            activeCategory={selectedCategory}
            onCategoryClick={handleCategoryClick}
          />

          <AppRoutes
            selectedCategory={selectedCategory}
          />
        </Router>
      </WebSocketProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
