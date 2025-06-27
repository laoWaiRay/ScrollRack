import { getDecks } from "@/actions/decks";
import useSWR from "swr";

export function useDeck() {
  const fetcher = () => getDecks();
  const { data, error, isLoading } = useSWR('/api/deck', fetcher)
  
  return { decks: data ?? [], isError: error, isLoading };
}
