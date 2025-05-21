import React from "react";

import decorationImg from "../Assets/departmets-vector.svg";
import hero1 from "../Assets/hero-1.png";
import hero2 from "../Assets/hero-2.png";
import herobg from "../Assets/hero-shape-2.png";
import contact from "../Assets/hero-shape-1.svg";
import { useNavigate } from "react-router";
// import { FaArrowRight } from "react-icons/fa6";

const Banner = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-3/4 flex  px-10 py-10">
      {" "}
      <div className="flex-1 p-6">
        <div className="flex flex-col items-start ">
          <img
            src={decorationImg}
            alt="Decoration"
            className="w-40 mb-2 self-start"
          />
          <h1 className="text-4xl font-bold text-sky-600 mt-4">
            Teach Yours, Learn Theirs - Perfect Your {""}
            <span className="text-4xl text-rose-400">Language Pairing</span> on
            Shall WeTalk!
          </h1>
        </div>

        <p className="mb-12 mt-12 text-gray-400 text-sm">
          Find your linguistic match and unlock fluency through conversation -
          Shall WeTalk is where cultures connect and languages live. Let's chat,
          let's exchange, let's grow!
        </p>

        <div className="flex items-center">
          <button
            onClick={() => navigate("/signup")}
            className=" text-white py-3 px-4 rounded-xl text-md hover:bg-sky-700 transition duration-300 hover:scale-90 bg-gradient-to-r from-sky-400 to bg-sky-600 w-auto"
          >
            Try it for Free
            {/* <FaArrowRight className="ml-36 -mt-5 text-lg" /> */}
          </button>
        </div>
      </div>
      {/* Right side (hero Image container) */}
      <div
        className="flex-1 relative bg-cover bg-center opacity-95"
        style={{
          backgroundImage: `url(${herobg})`,
          backgroundSize: "95%",
          backgroundRepeat: "no-repeat",
        }}
      >
        {" "}
        {/* Relative position for the container */}
        {/* Top left image */}
        <img
          src={hero1}
          alt="hero1"
          className="absolute top-0 left-0 w-1/2 h-auto object-cover rounded-br-md p-1 hover:scale-110 transition duration-300"
        />
        <img
          src={contact}
          alt="contact"
          className="absolute -bottom-8 left-14 w-1/2 h-1/5 object-cover rounded-br-md p-1 hover:scale-110 transition duration-300"
        />
        {/* Bottom right image */}
        <img
          src={hero2}
          alt="hero2"
          className="absolute bottom-0 right-0 w-1/2 h-4/5 object-cover rounded-tl-md p-1 hover:scale-110 transition duration-300 ml-4"
        />
      </div>
    </div>
  );
};

export default Banner;
