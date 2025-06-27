import { getStatSnapshots } from "@/actions/statSnapshots";
import useSWR from "swr";

export function useStatSnapshot() {
  const fetcher = () => getStatSnapshots();
  const { data, error, isLoading } = useSWR('/api/statSnapshot', fetcher)
  
  return { snapshots: data ?? [], isError: error, isLoading };
}
