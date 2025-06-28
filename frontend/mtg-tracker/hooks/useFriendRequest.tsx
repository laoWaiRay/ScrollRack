import { getReceivedFriendRequests } from "@/actions/friendRequests";
import useSWR from "swr";

export function useFriendRequest() {
  const fetcher = () => getReceivedFriendRequests();
  const { data, error, isLoading, mutate } = useSWR("/api/friendRequest/received", fetcher);
  
  return { friendRequests: data ?? [], isError: error, isLoading, mutate }
}