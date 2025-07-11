import React, { useState, useEffect } from "react";
import decorationImg from "../Assets/departmets-vector.svg";
import hero1 from "../Assets/hero-1.png";
import hero2 from "../Assets/hero-2.png";
import herobg from "../Assets/hero-shape-2.png";
import { useNavigate } from "react-router";
import { IoMdLogIn } from "react-icons/io";
import useAuthUser from "../hooks/useAuthUser";

const Banner = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthUser();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  let bgSize = "90%";
  let bgPosition = "center";
  if (windowWidth >= 460 && windowWidth <= 1026) {
    bgSize = "contain";
    bgPosition = "center";
  }

  return (
    <>
      <div className="w-full min-h-[70vh] flex flex-col md:flex-row px-4 md:px-10 py-2 sm:py-4 md:py-6 gap-4 bg-bgColor1">
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

          <p className="mb-6 mt-6 xl:mt-10 text-gray-500 text-sm  lg:text-lg">
            Find your linguistic match and unlock fluency through conversation -
            Shall WeTalk is where cultures connect and languages live. Let's
            chat, let's exchange, let's grow!
          </p>

          {/* Trusted by many users section */}
          <div className="flex flex-col items-start  mb-6 w-full">
            <div className="text-slate-500 text-xs sm:text-sm font-semibold mb-1 italic">
              Trusted by language lovers worldwide
            </div>
            <div className="flex -space-x-4 md:-space-x-3">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="user1"
                className="w-10 h-10 rounded-full border-2 border-white shadow-md"
              />
              <img
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="user2"
                className="w-10 h-10 rounded-full border-2 border-white shadow-md"
              />
              <img
                src="https://randomuser.me/api/portraits/men/58.jpg"
                alt="user3"
                className="w-10 h-10 rounded-full border-2 border-white shadow-md"
              />
              <img
                src="https://randomuser.me/api/portraits/women/65.jpg"
                alt="user4"
                className="w-10 h-10 rounded-full border-2 border-white shadow-md"
              />
              <img
                src="https://randomuser.me/api/portraits/men/76.jpg"
                alt="user5"
                className="w-10 h-10 rounded-full border-2 border-white shadow-md"
              />
              <img
                src="https://randomuser.me/api/portraits/women/81.jpg"
                alt="user6"
                className="w-10 h-10 rounded-full border-2 border-white shadow-md"
              />
              <img
                src="https://randomuser.me/api/portraits/men/41.jpg"
                alt="user7"
                className="w-10 h-10 rounded-full border-2 border-white shadow-md"
              />
              <img
                src="https://randomuser.me/api/portraits/women/33.jpg"
                alt="user8"
                className="w-10 h-10 rounded-full border-2 border-white shadow-md"
              />
              <img
                src="https://randomuser.me/api/portraits/men/23.jpg"
                alt="user9"
                className="w-10 h-10 rounded-full border-2 border-white shadow-md"
              />
              <img
                src="https://randomuser.me/api/portraits/women/51.jpg"
                alt="user10"
                className="w-10 h-10 rounded-full border-2 border-white shadow-md"
              />
              <img
                src="https://randomuser.me/api/portraits/men/45.jpg"
                alt="user11"
                className="w-10 h-10 rounded-full border-2 border-white shadow-md"
              />
              <img
                src="https://randomuser.me/api/portraits/women/90.jpg"
                alt="user12"
                className="w-10 h-10 rounded-full border-2 border-white shadow-md"
              />
              <span className="w-10 h-10 rounded-full bg-sky-100 border-2 border-white flex items-center justify-center text-xs text-sky-500 font-bold shadow-md">
                +1000
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {!authUser ? (
              <button
                onClick={() => navigate("/signup")}
                className="text-white py-3 px-4 rounded-xl text-md hover:bg-sky-700 transition duration-300 hover:scale-90 bg-gradient-to-r from-sky-400 to bg-sky-600 w-auto font-semibold "
              >
                Try it for Free
                <IoMdLogIn className="ml-36 -mt-5 text-lg" />
              </button>
            ) : (
              <button
                onClick={() => navigate("/practice-dashboard")}
                className="text-white py-3 px-4 rounded-xl text-md hover:bg-sky-700 transition duration-300 hover:scale-90 bg-gradient-to-r from-sky-400 to bg-sky-600 w-auto font-semibold "
              >
                Go to Dashboard
                <IoMdLogIn className="ml-44 -mt-5 text-lg" />
              </button>
            )}
          </div>
        </div>
        {/* Right side (hero Image container) */}
        <div
          className="flex-1 relative bg-cover bg-center opacity-95 min-h-[250px] md:min-h-0"
          style={{
            backgroundImage: `url(${herobg})`,
            backgroundSize: bgSize,
            backgroundPosition: bgPosition,
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Top left image */}
          <img
            src={hero1}
            alt="hero1"
            className="absolute top-0 left-0  w-1/2 h-4/5 object-contain rounded-br-md p-2  transition duration-300"
          />

          {/* Bottom right image */}
          <img
            src={hero2}
            alt="hero2"
            className="absolute bottom-0 right-2 w-1/2  h-4/5 object-contain rounded-tl-md p-2  transition duration-300 ml-2 sm:ml-4"
          />
        </div>
      </div>
      {/* Copyright Disclaimer */}
      <div className="w-full text-center text-xs text-gray-400 mt-4 lg:mt-10 font-semibold">
        &copy; {new Date().getFullYear()} Shall WeTalk. All rights reserved.
      </div>
    </>
  );
};

export default Banner;
