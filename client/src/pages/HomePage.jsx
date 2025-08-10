import Header from "../components/Header.jsx";
import Banner from "../components/Banner.jsx";
import Footer from "../components/Footer.jsx";

const HomePage = () => {
  return (
    <div className="flex flex-col h-screen bg-bgColor1 overflow-hidden">
      <Header />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Banner className="flex-1 flex items-center justify-center px-4 sm:px-8 md:px-16" />
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
