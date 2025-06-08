import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";
import { api } from "@/generated/client";
import { ActionType } from "@/context/AuthContext";

export function useLogout() {
	const router = useRouter();
	const { user, dispatch } = useAuth();

	async function logoutAsync() {
		try {
			await api.postApiUserlogout({}, { withCredentials: true });
		} catch (error) {
			console.error(error);
		}
		dispatch!({ type: ActionType.LOGOUT });
    router.push("/login");
	}
  
  return { logoutAsync };
}
