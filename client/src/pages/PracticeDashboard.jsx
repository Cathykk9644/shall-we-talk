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
import NoFriendsFound from "../components/NoFriendFound";
import { capitialize } from "../config/utils";

const PracticeDashboard = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const limit = 6; // Number of users per page

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

  const recommendedUsers = recommendedData.recommendedUsers || [];

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
    <div className="p-4 sm:p-6 lg:p-8 bg-bgColor1">
      <div className="container mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-500">
            Your Existing Friends
          </h2>
          <Link
            to="/notifications"
            className="btn btn-outline outline-gray-400 btn-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
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
                <p className="opacity-70 text-gray-500 mt-4 bg-slate-200 p-6 rounded-xl">
                  Hey get started with your language learning journey by
                  connecting with new language partners! Explore profiles of
                  learners who share your interests and language goals. Send
                  friend requests to start practicing together and enhance your
                  language skills through real conversations.
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                return (
                  <div
                    key={user._id}
                    className="card bg-slate-200 hover:shadow-lg transition-all duration-300 text-gray-600"
                  >
                    <div className="card-body p-6 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="avatar size-16 border-2 border-gray-300 rounded-full">
                          <img src={user.profilePic} alt={user.fullName} />
                        </div>

                        <div>
                          <h3 className="font-semibold text-lg">
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
                      <div className="flex flex-wrap gap-3">
                        <span className="badge bg-sky-500 text-white font-semibold  ">
                          {getLanguageFlag(user.nativeLanguage)}
                          Native: {capitialize(user.nativeLanguage)}
                        </span>
                        <span className="badge badge-outline text-gray-500 border-gray-400 font-semibold">
                          {getLanguageFlag(user.learningLanguage)}
                          Learning: {capitialize(user.learningLanguage)}
                        </span>
                      </div>

                      {user.bio && (
                        <p className="text-sm opacity-70">{user.bio}</p>
                      )}

                      {/* Action button */}
                      <button
                        className={`btn w-full mt-2 ${
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
