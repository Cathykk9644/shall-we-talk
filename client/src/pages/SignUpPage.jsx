import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router";
import loginbg from "../assets/loginbg.avif";
import logo from "../assets/Logo.jpeg";
import { RiChatSmile2Line } from "react-icons/ri";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { signup } from "../config/api.js";

const Signup = () => {
  const navigate = useNavigate();

  // Zod schema for validation
  const signupSchema = z.object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    terms: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms" }),
    }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: "onTouched",
  });

  const queryClient = useQueryClient();

  const {
    mutate: signUpMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: signup,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const onSubmit = (data) => {
    // Remove 'terms' before sending to API
    const { terms, ...signupData } = data;
    signUpMutation(signupData);
  };

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
      </div>

      {/* Right hand Side with Signup Form */}
      <div className="flex flex-col gap-8 w-full md:w-1/2 bg-bgColor1 p-6 md:py-12 md:px-20 lg:py-36 ">
        <Link to="/" className="flex justify-center hover:scale-95">
          <img src={logo} alt="logo" className="w-48 object-cover " />
        </Link>

        {/* ERROR MESSAGE IF ANY */}
        {error && (
          <div className="alert alert-error bg-rose-400 text-white text-sm font-bold">
            <span>{error.response.data.message}</span>
          </div>
        )}
        <h1 className="text-xl font-bold text-sky-500 items-center">
          Let's start to create account
        </h1>
        <form
          className="flex flex-col space-y-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {/* FULLNAME */}
          <div className="w-full">
            <label className="block text-gray-400 text-xs font-semibold">
              Full Name
            </label>
            <input
              className="h-10 block w-full mt-2 rounded-md border-0 p-4 text-gray-500 text-xs shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-0 focus:ring-1 focus:ring-inset focus:ring-sky-600"
              type="text"
              placeholder="Steve Jobs"
              {...register("fullName")}
            />
            {errors.fullName && (
              <span className="text-xs text-rose-500 font-semibold">
                {errors.fullName.message}
              </span>
            )}
          </div>
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

          <div className="form-control">
            <label className="label cursor-pointer justify-center gap-2">
              <input
                type="checkbox"
                className="checkbox checkbox-xs "
                {...register("terms")}
              />
              <span className="text-xs leading-tight text-gray-400 font-semibold">
                I agree to the{" "}
                <span className=" hover:underline hover:text-gray-500 text-gray-400 font-semibold  hover:font-bold">
                  terms of service
                </span>{" "}
                and{" "}
                <span className=" hover:underline hover:text-gray-500 text-gray-400 font-semibold  hover:font-bold">
                  privacy policy
                </span>
              </span>
            </label>
            {errors.terms && (
              <span className="text-xs text-rose-500 font-semibold block text-center">
                {errors.terms.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="h-10 px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-bgColor3 text-sm focus:outline-none font-semibold hover:scale-95"
          >
            {isPending ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Loading...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="text-center">
          <p className="text-xs text-gray-400 mb-4 font-semibold">
            Already have an account with us?{" "}
            <span
              className="underline cursor-pointer font-semibold text-sky-500 hover:text-sky-600 hover:font-bold"
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
