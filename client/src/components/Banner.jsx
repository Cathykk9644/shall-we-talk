import React from "react";
import decorationImg from "../Assets/departmets-vector.svg";
import hero1 from "../Assets/hero-1.png";
import hero2 from "../Assets/hero-2.png";
import herobg from "../Assets/hero-shape-2.png";

import { useNavigate } from "react-router";
import { IoMdLogIn } from "react-icons/io";

const Banner = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-[70vh] flex flex-col md:flex-row px-4 md:px-10 py-2 sm:py-4 md:py-10 gap-8">
      <div className="flex-1 md:p-6 xl:p-8 flex flex-col justify-center">
        <div className="flex flex-col items-start">
          <img
            src={decorationImg}
            alt="Decoration"
            className="w-16 sm:w-28 xl:w-44 mb-2 self-start"
          />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-sky-600 mt-4 lg:mt-8">
            Teach Yours, Learn Theirs - Perfect Your{" "}
            <span className="text-3xl sm:text-4xl lg:text-5xl text-rose-400">
              Language Pairing
            </span>{" "}
            Experience on Shall WeTalk!
          </h1>
        </div>

        <p className="mb-6 mt-6 xl:mt-10 text-gray-500 text-sm sm:text-base lg:text-lg">
          Find your linguistic match and unlock fluency through conversation -
          Shall WeTalk is where cultures connect and languages live. Let's chat,
          let's exchange, let's grow!
        </p>

        <div className="flex items-center">
          <button
            onClick={() => navigate("/signup")}
            className="text-white py-3 px-4 rounded-xl text-md hover:bg-sky-700 transition duration-300 hover:scale-90 bg-gradient-to-r from-sky-400 to bg-sky-600 w-auto "
          >
            Try it for Free
            <IoMdLogIn className="ml-36 -mt-5 text-lg" />
          </button>
        </div>
      </div>
      {/* Right side (hero Image container) */}
      <div
        className="flex-1 relative bg-cover bg-center opacity-95 min-h-[250px] md:min-h-0"
        style={{
          backgroundImage: `url(${herobg})`,
          backgroundSize: "95%",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Top left image */}
        <img
          src={hero1}
          alt="hero1"
          className="absolute top-0 left-0 w-1/2 h-auto object-cover rounded-br-md p-1 hover:scale-105 transition duration-300"
        />

        {/* Bottom right image */}
        <img
          src={hero2}
          alt="hero2"
          className="absolute bottom-0 right-0 w-1/2  h-4/5 object-cover rounded-tl-md p-1 hover:scale-105 transition duration-300 ml-2 sm:ml-4"
        />
      </div>
    </div>
  );
};

export default Banner;
