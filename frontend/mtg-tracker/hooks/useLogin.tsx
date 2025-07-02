import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useAuth } from "./useAuth";
import { ActionType } from "@/context/AuthContext";
import { UserLoginDTO, UserReadDTO } from "@/types/client";
import { login } from "@/actions/user";

export function useLogin() {
	const router = useRouter();
  const { dispatch } = useAuth();
 
  async function _loginAsync(email: string, password: string) {
    let user: UserReadDTO | null = null;

    try {
      const loginDTO: UserLoginDTO = {
        email,
        password,
      };
      user = await login(loginDTO);
      
      dispatch({ type: ActionType.LOGIN, payload: user });
      router.push("/commandzone");
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  const loginAsync = useCallback(_loginAsync, []);
  
  return { loginAsync };
}
