import { getFriends } from "@/actions/friends";
import { extractAuthResult } from "@/helpers/extractAuthResult";
import useSWR from "swr";

export function useFriend() {
  const fetcher = async () => {
    const authResult = await getFriends();
    return extractAuthResult(authResult) ?? [];
  }
  const { data, error, isLoading, mutate } = useSWR('/api/friends', fetcher);
  
  return { friends: data ?? [], isError: error, isLoading, mutate }
}