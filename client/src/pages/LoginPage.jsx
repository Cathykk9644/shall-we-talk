import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import loginbg from "../assets/loginbg.avif";
import logo from "../assets/Logo.jpeg";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { login } from "../config/api";

import { RiChatSmile2Line } from "react-icons/ri";

const LoginPage = () => {
  const navigate = useNavigate();

  // Zod schema for login
  const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const queryClient = useQueryClient();

  const {
    mutate: loginMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: login,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  const onSubmit = (data) => {
    loginMutation(data);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left hand Side with Background Image and Transparent Container */}
      <div
        className="hidden md:block md:w-1/2 bg-cover py-36 px-12 object-fill"
        style={{ backgroundImage: `url(${loginbg})` }}
      >
        <div
          className="bg-white bg-opacity-20 rounded-lg p-8 backdrop-filter backdrop-blur-md lg:mt-20"
          style={{ backdropFilter: "blur(5px)" }}
        >
          <div className="flex space-x-4 mb-8">
            <RiChatSmile2Line className="text-white text-5xl" />
            <h1 className="text-4xl font-bold text-white ">Welcome Back!</h1>
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
        </div>
      </div>

      {/* Right hand Side with Login Form */}
      <div className="flex flex-col gap-8 w-full md:w-1/2 bg-bgColor1 p-6 md:py-12 md:px-20 lg:py-36 mt-10">
        <Link to="/" className="flex justify-center hover:scale-95">
          <img src={logo} alt="logo" className="w-48 object-cover" />
        </Link>

        {/* ERROR MESSAGE DISPLAY */}
        {error && (
          <div className="alert alert-error mb-4 text-white font-semibold">
            <span>{error.response.data.message}</span>
          </div>
        )}

        <h1 className="text-xl font-bold text-sky-500 items-center">
          Log in to your account
        </h1>
        <form
          className="flex flex-col space-y-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {/* EMAIL */}
          <div className="w-full">
            <label className="block text-gray-400 text-xs font-semibold">
              Email
            </label>
            <input
              className="h-10 block w-full mt-2 rounded-md border-0 p-4 text-gray-500 text-xs shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-0 focus:ring-1 focus:ring-inset focus:ring-sky-600"
              type="email"
              placeholder="SteveJobs@apple.com"
              {...register("email")}
            />
            {errors.email && (
              <span className="text-xs text-rose-500 font-semibold">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* PASSWORD */}
          <div className="w-full">
            <label className="block text-gray-400 text-xs font-semibold">
              Password
            </label>
            <input
              className="h-10 block w-full mt-2 rounded-md border-0 p-4 text-gray-500 text-xs shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-0 focus:ring-1 focus:ring-inset focus:ring-sky-600"
              type="password"
              placeholder="***********"
              {...register("password")}
            />
            {errors.password && (
              <span className="text-xs text-rose-500 font-semibold">
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="h-10 px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-bgColor3 text-sm focus:outline-none font-semibold hover:scale-95"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Logging in...
              </>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        <div className="text-center">
          <p className="text-xs text-gray-400 mb-4 font-semibold">
            Don't have an account?{" "}
            <span
              className="underline cursor-pointer font-semibold text-sky-500 hover:text-sky-600 hover:font-bold"
              onClick={() => navigate("/signup")}
            >
              Sign up now!
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
