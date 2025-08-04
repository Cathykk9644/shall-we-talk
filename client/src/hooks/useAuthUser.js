import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../config/api";

const useAuthUser = () => {
  const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false,
    // Remove the onError since 401 is expected for non-authenticated users
    staleTime: 5 * 60 * 1000, // Consider auth data fresh for 5 minutes
  });

  return { isLoading: authUser.isLoading, authUser: authUser.data?.user };
};
export default useAuthUser;
