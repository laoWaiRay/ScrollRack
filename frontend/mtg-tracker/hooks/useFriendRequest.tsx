import { getReceivedFriendRequestUsers } from "@/actions/friendRequests";
import { extractAuthResult } from "@/helpers/extractAuthResult";
import useSWR from "swr";

export function useFriendRequest() {
  const fetcher = async () => {
    const authResult = await getReceivedFriendRequestUsers();
    const data = extractAuthResult(authResult);
    return data;
  };
  const { data, error, isLoading, mutate } = useSWR("/api/friendRequest/received", fetcher);
  
  return { friendRequests: data ?? [], isError: error, isLoading, mutate }
}