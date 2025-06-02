import React from "react";
import Header from "../components/Header.jsx";
import Banner from "../components/Banner.jsx";

const HomePage = () => {
  return (
    <div className="relative min-h-screen w-full bg-bgColor1">
      <div className="absolute inset-0 w-full h-full flex flex-col">
        <Header />
        <div>
          <Banner className="flex-1 flex items-center justify-center px-4 sm:px-8 md:px-16" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
