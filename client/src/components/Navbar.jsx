import React, { useState } from "react";
import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { logout, getFriendRequests } from "../config/api";
import LOGO from "../Assets/Logo.jpeg";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  // Fetch friend requests for notification count
  const { data: friendRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });
  const incomingCount = friendRequests?.incomingReqs?.length || 0;

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
    <>
      <nav className="bg-bgColor1 border-b-2 border-base-300 sticky top-0 z-30 h-16 flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-end w-full  space-x-4">
            {/* LOGO - ONLY IN THE CHAT PAGE */}
            {isChatPage && (
              <div className="pl-2">
                <Link to="/" className="flex justify-start gap-2.5">
                  <img
                    src={LOGO}
                    alt="logo"
                    className="w-44 h-30  object-cover hover:scale-90"
                  />
                </Link>
              </div>
            )}

            <div className="flex items-center gap-3 sm:gap-8 ml-auto">
              <Link to={"/notifications"} className="relative">
                <button className="btn btn-ghost btn-circle">
                  <BellIcon className="size-7 text-sky-600 opacity-90" />
                  {incomingCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-400 text-white rounded-full text-xs px-2 py-1 flex items-center justify-center min-w-[1.25rem] min-h-[1.25rem]">
                      {incomingCount}
                    </span>
                  )}
                </button>
              </Link>

              <div className="avatar">
                <div className="w-9 rounded-full border-2 border-sky-200">
                  <img
                    src={authUser?.profilePic}
                    alt="User Avatar"
                    rel="noreferrer"
                  />
                </div>
                {authUser?.fullName && (
                  <span className="text-sky-600 text-sm hidden sm:inline ml-2 mt-2 font-semibold">
                    Hey {authUser.fullName.split(" ")[0]}!
                  </span>
                )}
              </div>
            </div>

            {/* Logout button */}
            <button
              className="btn btn-ghost btn-circle"
              onClick={handleLogoutClick}
            >
              <LogOutIcon className="size-6 text-sky-600 opacity-80" />
            </button>
          </div>
        </div>
      </nav>

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
    </>
  );
};

export default Navbar;
