import { getStatSnapshots } from "@/actions/statSnapshots";
import { extractAuthResult } from "@/helpers/extractAuthResult";
import useSWR from "swr";

export function useStatSnapshot() {
  const fetcher = async () => {
    const authResult = await getStatSnapshots()
    return extractAuthResult(authResult);
  };
  const { data, error, isLoading } = useSWR('/api/statSnapshot', fetcher)
  
  return { snapshots: data ?? [], isError: error, isLoading };
}
