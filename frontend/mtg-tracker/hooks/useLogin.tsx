import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useAuth } from "./useAuth";
import { ActionType } from "@/context/AuthContext";
import { UserLoginDTO } from "@/types/client";
import { login } from "@/actions/user";
import { ServerApiError } from "@/types/server";

export function useLogin() {
	const router = useRouter();
	const { dispatch } = useAuth();

	async function _loginAsync(email: string, password: string) {
		const loginDTO: UserLoginDTO = {
			email,
			password,
		};
		const authResult = await login(loginDTO);

		if (authResult.success && authResult.data) {
			dispatch({ type: ActionType.LOGIN, payload: authResult.data });
			router.push("/commandzone");
		} else {
			const { status = 500, data = "Error" } = authResult.error ?? {};
			throw new ServerApiError(status, data);
		}
	}

	const loginAsync = useCallback(_loginAsync, []);

	return { loginAsync };
}
