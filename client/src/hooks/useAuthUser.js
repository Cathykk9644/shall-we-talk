import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../config/api";

const useAuthUser = () => {
  const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false,
    onError: (error) => {
      console.error("Failed to fetch authenticated user:", error);
    },
  });

  return { isLoading: authUser.isLoading, authUser: authUser.data?.user };
};
export default useAuthUser;
