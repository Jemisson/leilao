import React from "react";
import Navbar from "./components/Navbar";
import ProductCatalog from "./components/ProductCatalog";

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <ProductCatalog />
    </>
  );
};

export default App;
