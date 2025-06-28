import { api } from "@/generated/client";
import useSWR from "swr";

export function useFriendDeck(friendId: string) {
  const shouldFetch = friendId !== "";

  const fetcher = () => {
    return api.getApiDeckfriendId({ params: { id: friendId }, withCredentials: true });
  };

  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? `/api/deck/friend/${friendId}` : null,
    fetcher
  );

  return {
    decks: data ?? [],
    isError: !!error,
    isLoading,
    mutate,
  };
}