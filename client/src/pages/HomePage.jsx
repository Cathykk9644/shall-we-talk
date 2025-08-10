// import React from "react";
// import Header from "../components/Header.jsx";
// import Banner from "../components/Banner.jsx";
// import Footer from "../components/Footer.jsx";

// const HomePage = () => {
//   return (
//     <div className="relative min-h-screen w-full bg-bgColor1">
//       <div className="absolute inset-0 w-full h-full flex flex-col">
//         <Header />
//         <div className="bg-bgColor1">
//           <Banner className="flex-1 flex items-center justify-center px-4 sm:px-8 md:px-16" />
//           <Footer />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomePage;
import React from "react";
import Header from "../components/Header.jsx";
import Banner from "../components/Banner.jsx";
import Footer from "../components/Footer.jsx";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-bgColor1">
      <Header />
      <div className="flex-1 flex flex-col">
        <Banner className="flex-1 flex items-center justify-center px-4 sm:px-8 md:px-16" />
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
