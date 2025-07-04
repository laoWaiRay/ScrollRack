import { getStatSnapshots } from "@/actions/statSnapshots";
import { extractAuthResult } from "@/helpers/extractAuthResult";
import { StatSnapshotDTO } from "@/types/client";
import useSWR from "swr";

export function useStatSnapshot() {
  const fetcher = async () => {
    const authResult = await getStatSnapshots()
    return extractAuthResult(authResult);
  };
  const { data, error, isLoading } = useSWR('/api/statSnapshot', fetcher)
  
  return { snapshots: data ?? [], isError: error, isLoading };
}

export const defaultStatSnapshot: StatSnapshotDTO = {
  gamesPlayed: 0,
  gamesWon: 0,
  numDecks: 0,
  currentWinStreak: 0,
  longestWinStreak: 0,
  longestLossStreak: 0,
  mostPlayedCommanders: [],
  leastPlayedCommanders: [],
}