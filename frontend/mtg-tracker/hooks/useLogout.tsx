import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";
import { ActionType } from "@/context/AuthContext";
import { logout } from "@/actions/user";

export function useLogout() {
	const router = useRouter();
	const { dispatch } = useAuth();

	async function logoutAsync() {
    await logout();
		dispatch({ type: ActionType.LOGOUT });
    router.push("/login");
	}
  
  return { logoutAsync };
}
