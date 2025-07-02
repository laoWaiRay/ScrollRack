import { getFriendDecks } from "@/actions/decks";
import { extractAuthResult } from "@/helpers/extractAuthResult";
import useSWR from "swr";

export function useFriendDeck(friendId: string) {
  const shouldFetch = friendId !== "";

  const fetcher = async () => {
    const authResult = await getFriendDecks(friendId);
    const data = extractAuthResult(authResult) ?? [];
    return data;
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