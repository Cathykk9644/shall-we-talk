import React from "react";
import LOGO from "../Assets/Logo.jpeg";

import { useNavigate, Link } from "react-router";

const Header = () => {
  const navigate = useNavigate();
  return (
    <div className="w-screen z-50 px-14 py-8">
      <div className="flex justify-between items-center h-full">
        <div className="flex items-center">
          <img
            src={LOGO}
            alt="logo"
            className="w-44 object-cover hover:scale-90"
          />
        </div>

        <div className="flex items-center">
          <button
            onClick={() => navigate("/login")}
            className="text-md font-semibold text-textColor1 hover:text-headingColor duration-100 transition-all cursor-pointer ease-in-out mr-4"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="bg-buttonColor hover:bg-buttonHoverColor text-white text-md font-semibold py-2 px-6 rounded-xl duration-100 transition-all ease-in-out hover:scale-90 hover:bg-headingColor "
          >
            Signup
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
