import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getUserFriends,
  getRecommendedUsers,
  getOutgoingFriendReqs,
  sendFriendRequest,
} from "../config/api";
import { Link } from "react-router";
import {
  CheckCircleIcon,
  MapPinIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";
import FriendCard, { getLanguageFlag } from "../components/FriendCard";
import FriendSection from "../components/FriendSection";
import NoFriendsFound from "../components/NoFriendFound";
import { capitialize } from "../config/utils";

const PracticeDashboard = () => {
  const queryClient = useQueryClient();

  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  // Search state
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const limit = 6;

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedData = {}, isLoading: loadingUsers } = useQuery({
    queryKey: ["users", page],
    queryFn: () => getRecommendedUsers(page, limit),

    onError: (error) => {
      console.error("Error fetching recommended users:", error);
    },
  });

  useEffect(() => {
    if (recommendedData && typeof recommendedData.totalUsers === "number") {
      setTotalUsers(recommendedData.totalUsers);
    }
  }, [recommendedData]);

  // Filter users by search
  const recommendedUsers = (recommendedData.recommendedUsers || []).filter(
    (user) => {
      if (!search.trim()) return true;
      const q = search.trim().toLowerCase();
      return (
        user.fullName?.toLowerCase().includes(q) ||
        user.nativeLanguage?.toLowerCase().includes(q) ||
        user.learningLanguage?.toLowerCase().includes(q) ||
        user.location?.toLowerCase().includes(q) ||
        user.bio?.toLowerCase().includes(q)
      );
    }
  );

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  useEffect(() => {
    console.log("Updated Total Users:", totalUsers);
  }, [totalUsers]);

  return (
    <div className="px-4 py-4 sm:p-6 lg:p-8 bg-bgColor1 min-h-screen w-full">
      <div className="w-full mx-auto space-y-4 px-0 sm:px-4">
        {/* Search Bar */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-500">
            Find Language Partners
          </h2>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name, language, location, or bio..."
            className="input input-bordered w-full sm:w-96 bg-white text-gray-700"
            aria-label="Search users"
          />
        </div>

        {/* Existing Friends Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 w-full">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-500">
            Your Existing Friends
          </h2>
          <Link
            to="/notifications"
            className="btn btn-outline outline-gray-400 btn-xs sm:btn-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200"
          >
            <UsersIcon className="mr-2 size-4 text-gray-500" />
            Friend Requests
          </Link>
        </div>

        {/* Existing Friend Section */}
        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg text-sky-500" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="-mx-2 sm:mx-0 ">
            <FriendSection friends={friends} />
          </div>
        )}

        {/* Recommend New Friend Section */}
        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-500">
                  Meet New Learners
                </h2>
                <p className="opacity-80 text-gray-500 mt-4 bg-slate-200 p-6 rounded-xl text-justify">
                  <span className="text-4xl bg-opacity-50">👋 😉</span> Welcome
                  to our unique language exchange platform! Here, you can use
                  your native language to help others learn, while also finding
                  native speakers of the language you wish to master. Connect
                  with learners and teachers from around the world, share your
                  expertise, and immerse yourself in real conversations. Explore
                  profiles, send friend requests, and start practicing together
                  to accelerate your language journey through authentic,
                  meaningful exchanges.
                </p>
              </div>
            </div>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg text-sky-500" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-slate-200 p-6 text-start text-gray-500">
              <h3 className="font-semibold text-lg mb-2">
                No recommendations available
              </h3>
              <p className="text-gray-500 opacity-70">
                Check back later for new language partners!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                return (
                  <div
                    key={user._id}
                    className="card bg-slate-200 hover:shadow-lg transition-all duration-300 text-gray-600 min-w-0"
                  >
                    <div className="card-body p-4 sm:p-6 space-y-3 sm:space-y-4">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="avatar size-14 sm:size-16 border-2 border-gray-300 rounded-full overflow-hidden">
                          <img
                            src={user.profilePic}
                            alt={user.fullName}
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-base sm:text-lg">
                            {user.fullName}
                          </h3>
                          {user.location && (
                            <div className="flex items-center text-xs opacity-70 mt-1">
                              <MapPinIcon className="size-3 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Languages with flags */}
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        <span className="badge bg-sky-500 text-white font-semibold text-xs sm:text-sm">
                          {getLanguageFlag(user.nativeLanguage)}
                          Native: {capitialize(user.nativeLanguage)}
                        </span>
                        <span className="badge badge-outline text-gray-500 border-gray-400 font-semibold text-xs sm:text-sm">
                          {getLanguageFlag(user.learningLanguage)}
                          Learning: {capitialize(user.learningLanguage)}
                        </span>
                      </div>

                      {user.bio && (
                        <p className="text-xs sm:text-sm opacity-70 text-justify">
                          {user.bio}
                        </p>
                      )}

                      {/* Action button */}
                      <button
                        className={`btn w-full mt-2 px-2 py-1 text-xs sm:text-sm ${
                          hasRequestBeenSent
                            ? "btn-disabled"
                            : "bg-sky-500 hover:bg-sky-600 text-white"
                        } `}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-2" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-2" />
                            Send Friend Request
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex justify-center mt-6 join">
            <button
              className="btn  mr-2 join-item bg-slate-200 text-gray-400 hover:bg-slate-300"
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            >
              «
            </button>
            <span className=" join-item btn mr-2  bg-slate-200 text-gray-400 hover:bg-slate-300">
              Page {page}
            </span>
            <button
              className="btn  ml-2 join-item  bg-slate-200 text-gray-400 hover:bg-slate-300"
              disabled={page * limit >= totalUsers}
              onClick={() => setPage((prev) => prev + 1)}
            >
              »
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PracticeDashboard;
