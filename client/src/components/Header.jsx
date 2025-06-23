import React from "react";
import LOGO from "../Assets/Logo.jpeg";
import { useNavigate, Link } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { UserIcon, LogOutIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../config/api";

const Header = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthUser();

  const queryClient = useQueryClient();
  const { mutate: logoutMutation } = useMutation({
    mutationFn: logout,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  return (
    <div className="w-screen z-50 md:px-14 md:py-8 px-3 py-4 xl:py-12">
      <div className="flex justify-between items-center h-full">
        <div className="flex items-center">
          <img
            src={LOGO}
            alt="logo"
            className="xl:w-64 md:w-48 w-40 object-cover hover:scale-90"
          />
        </div>

        <div className="flex items-center">
          {!authUser ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="text-md xl:text-lg font-semibold text-textColor1 hover:text-headingColor duration-100 transition-all cursor-pointer ease-in-out mr-4 lg:mr-8"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="bg-buttonColor hover:bg-buttonHoverColor text-white text-md xl:text-lg font-semibold py-2 px-6 rounded-xl duration-100 transition-all ease-in-out hover:scale-90 hover:bg-headingColor "
              >
                Signup
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mr-4">
                {authUser.profilePic ? (
                  <img
                    src={authUser.profilePic}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full border-2 border-textColor1 object-cover"
                  />
                ) : (
                  <span className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-textColor1 font-bold">
                    {authUser.fullName?.charAt(0)}
                  </span>
                )}
                <span className="font-semibold text-textColor1 text-sm xl:text-lg">
                  Hey {authUser.fullName}!
                </span>
                <button
                  onClick={logoutMutation}
                  className="ml-2 p-2 rounded-full hover:bg-gray-200 transition"
                  title="Logout"
                >
                  <LogOutIcon className="w-5 h-5 text-textColor1" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
