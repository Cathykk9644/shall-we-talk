import React from "react";

import { useNavigate, Link } from "react-router";
import loginbg from "../Assets/loginbg.avif";
import logo from "../Assets/Logo.jpeg";

import loginImg from "../Assets/landingbg3.png";
import { RiChatSmile2Line } from "react-icons/ri";

const Signup = () => {
  const navigate = useNavigate();

  // const [signupData, setSignupData] = useState({
  //   fullName: "",
  //   email: "",
  //   password: "",
  // });

  return (
    <div className="flex min-h-screen">
      {/* Left hand Side with Background Image and Transparent Container */}
      <div
        className="hidden md:block md:w-1/2 bg-cover py-36 px-12 object-fill"
        style={{ backgroundImage: `url(${loginbg})` }}
      >
        {/* Transparent container */}
        <div
          className="bg-white  bg-opacity-20 rounded-lg p-8 backdrop-filter backdrop-blur-md lg:mt-20"
          style={{ backdropFilter: "blur(5px)" }}
        >
          <div className="flex space-x-4 ">
            <RiChatSmile2Line className="text-white text-5xl" />
            <h1 className="text-4xl font-bold text-white mb-8">Hey Friend!</h1>
          </div>

          <p className="text-3xl font-semibold text-white mb-2">
            Chat Globally
          </p>
          <p className="text-3xl font-semibold text-white mb-2">
            Connect Locally
          </p>
          <p className="text-3xl font-semibold text-white mb-16">
            Right Here On Shall Wetalk!
          </p>
        </div>{" "}
        <img
          src={loginImg}
          alt="loginImg"
          className="absolute md:bottom-20 left-12 m-4 max-w-xs object-cover opacity-40 lg:bottom-48"
          style={{ maxWidth: "220px" }}
        />
      </div>

      {/* Right hand Side with Signup Form */}
      <div className="flex flex-col gap-8 w-full md:w-1/2 bg-bgColor1 p-6 md:py-12 md:px-20 lg:py-36 ">
        <Link to="/" className="flex justify-center hover:scale-95">
          <img src={logo} alt="logo" className="w-48 object-cover " />
        </Link>
        <h1 className="text-xl font-bold text-sky-500 items-center">
          Let's start to create account
        </h1>
        <form className="flex flex-col space-y-4">
          <div className="w-full">
            <label className="block text-gray-400 text-xs font-semibold">
              Full Name
            </label>
            <input
              className="h-10 block w-full mt-2 rounded-md border-0 p-4 text-gray-500 text-xs shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-0 focus:ring-1 focus:ring-inset focus:ring-sky-600"
              name="name"
              type="text"
              placeholder="Steve Jobs"
              required
            />
          </div>
          <div className="w-full">
            <label className="block text-gray-400 text-xs font-semibold">
              Email
            </label>
            <input
              className="h-10 block w-full mt-2 rounded-md border-0 p-4 text-gray-500 text-xs shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-0 focus:ring-1 focus:ring-inset focus:ring-sky-600"
              name="email"
              type="email"
              placeholder="SteveJobs@apple.com"
              required
            />
          </div>

          <div className="w-full">
            <label className="block text-gray-400 text-xs font-semibold">
              Password
            </label>
            <input
              className="h-10 block w-full mt-2 rounded-md border-0 p-4 text-gray-500 text-xs shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-0 focus:ring-1 focus:ring-inset focus:ring-sky-600"
              name="password"
              type="password"
              placeholder="***********"
              required
            />
          </div>

          <div className="form-control">
            <label className="label cursor-pointer justify-center gap-2">
              <input
                type="checkbox"
                className="checkbox checkbox-xs "
                required
              />
              <span className="text-xs leading-tight text-gray-500">
                I agree to the{" "}
                <span className=" hover:underline text-gray-500">
                  terms of service
                </span>{" "}
                and{" "}
                <span className=" hover:underline text-gray-500">
                  privacy policy
                </span>
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="h-10 px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-bgColor3 text-sm focus:outline-none font-semibold hover:scale-95"
          >
            Create Account
          </button>
        </form>

        <div className="text-center">
          <p className="text-xs text-gray-400 mb-4">
            Already have an account with us?{" "}
            <span
              className="underline cursor-pointer font-semibold text-sky-500 hover:text-sky-600 "
              onClick={() => navigate("/login")}
            >
              Log in now!
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
