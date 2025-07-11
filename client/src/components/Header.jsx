import React, { useState } from "react";
import LOGO from "../Assets/Logo.jpeg";
import { useNavigate, Link } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { UserIcon, LogOutIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../config/api";

const Header = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthUser();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const queryClient = useQueryClient();
  const { mutate: logoutMutation } = useMutation({
    mutationFn: logout,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  const handleLogoutClick = () => setShowLogoutModal(true);
  const confirmLogout = () => {
    setShowLogoutModal(false);
    logoutMutation();
  };
  const cancelLogout = () => setShowLogoutModal(false);

  return (
    <div className="w-screen z-50 md:px-14 md:py-8 px-3 py-4 xl:py-12">
      <div className="flex justify-between items-center h-full">
        <div className="flex items-center">
          <img
            src={LOGO}
            alt="logo"
            className="xl:w-56 md:w-48 w-40 object-cover "
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
                    className="size-8 md:size-12 rounded-full border-2 border-textColor1 object-cover"
                  />
                ) : (
                  <span className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-textColor1 font-bold">
                    {authUser.fullName?.charAt(0)}
                  </span>
                )}
                <span className="font-semibold text-textColor1 text-sm xl:text-lg">
                  Hey {authUser.fullName.split(" ")[0]}!
                </span>
                <button
                  onClick={handleLogoutClick}
                  className="ml-2 p-2 rounded-full hover:bg-gray-200 transition"
                  title="Logout"
                >
                  <LogOutIcon className="size-4 md:size-6 text-textColor1" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-sky-800 bg-opacity-40 z-50">
          <div className="bg-slate-200 rounded-2xl shadow-md p-10 max-w-sm w-full border-sky-600 border-2 flex flex-col items-center">
            <h3 className="text-2xl font-bold mb-4 text-gray-600">
              Confirm Logout
            </h3>
            <p className="mb-6 text-gray-500 text-center text-sm font-semibold">
              Are you sure you want to log out? You will need to log in again to
              access your account.
            </p>
            <div className="flex justify-center gap-3 w-full">
              <button
                onClick={cancelLogout}
                className="btn bg-sky-500 hover:bg-sky-600 text-white font-semibold px-4 py-1 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="btn bg-rose-400 hover:bg-rose-500 text-white font-semibold px-4 py-1 rounded-xl"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
