import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import {
  BellIcon,
  UserIcon,
  ShipWheelIcon,
  UsersIcon,
  HomeIcon,
} from "lucide-react";
import { FaRegPaperPlane } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { getFriendRequests } from "../config/api";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  const { data: friendRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const incomingCount = friendRequests?.incomingReqs?.length || 0;

  return (
    <aside className="w-64 lg:w-74 bg-sky-500 border-r border-base-300 hidden md:flex flex-col h-screen sticky top-0">
      <div className="p-6 ">
        <Link to="/" className="flex items-center gap-3">
          <FaRegPaperPlane className="size-9 text-white" />
          <span className="text-xl font-bold text-white  ">Shall WeTalk</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2 text-white ">
        <Link
          to="/"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/" ? "btn-active" : ""
          }`}
        >
          <HomeIcon className="size-6 text-white opacity-90" />
          <span className="text-lg">Home</span>
        </Link>

        <Link
          to="/practice-dashboard"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/practice-dashboard" ? "btn-active" : ""
          }`}
        >
          <ShipWheelIcon className="size-6  opacity-90 " />
          <span className="text-lg">Dashboard</span>
        </Link>

        <Link
          to="/notifications"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/notifications" ? "btn-active" : ""
          }`}
        >
          <div className="relative flex items-center gap-2">
            <BellIcon className="size-6 text-white opacity-90" />
            <span className="text-lg">Notifications</span>
            {incomingCount > 0 && (
              <span className="absolute -top-2 -right-5 bg-rose-400 text-white rounded-full text-xs px-2 py-1 flex items-center justify-center min-w-[1.5rem] min-h-[1.5rem]">
                {incomingCount}
              </span>
            )}
          </div>
        </Link>

        <Link
          to="/profile"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/profile" ? "btn-active" : ""
          }`}
        >
          <UserIcon className="size-6 text-white opacity-90" />
          <span className="text-lg">Profile</span>
        </Link>
      </nav>

      {/* USER PROFILE SECTION */}
      <div className="p-4 border-t-2 border-white mt-auto">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-10 rounded-full border-white border-2">
              <img src={authUser?.profilePic} alt="User Avatar" />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm text-white">
              {authUser?.fullName}
            </p>
            <p className="text-xs text-white flex items-center gap-1">
              <span className="size-2 rounded-full bg-white inline-block" />
              Online
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
