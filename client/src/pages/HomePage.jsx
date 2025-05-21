import React from "react";
import Header from "../components/Header.jsx";
import Banner from "../components/Banner.jsx";

const HomePage = () => {
  return (
    <div className="relative w-screen h-screen bg-bgColor1">
      <div className="absolute top-0 left-0 w-full h-full">
        <Header />
        <Banner />
      </div>
    </div>
  );
};

export default HomePage;
