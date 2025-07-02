import { getDecks } from "@/actions/decks";
import { extractAuthResult } from "@/helpers/extractAuthResult";
import { DeckStats } from "@/types/client";
import useSWR from "swr";

export function useDeck() {
  const fetcher = async () => {
    const authResult = await getDecks();
    return extractAuthResult(authResult);
  };
  const { data, error, isLoading, mutate } = useSWR('/api/deck', fetcher)
  
  return { decks: data ?? [], isError: error, isLoading, mutate };
}

export const defaultDeckStats: DeckStats = {
  numGames: 0,
  numWins: 0,
};