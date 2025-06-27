import { getDecks } from "@/actions/decks";
import { DeckStats } from "@/types/client";
import useSWR from "swr";

export function useDeck() {
  const fetcher = () => getDecks();
  const { data, error, isLoading, mutate } = useSWR('/api/deck', fetcher)
  
  return { decks: data ?? [], isError: error, isLoading, mutate };
}

export const defaultDeckStats: DeckStats = {
  numGames: 0,
  numWins: 0,
};