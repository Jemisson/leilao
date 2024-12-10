import React from "react";
import CategoryList from "./components/CategoryList";
import Navbar from "./components/Navbar";

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <div>
        <CategoryList />
      </div>
    </>
  );
};

export default App;
