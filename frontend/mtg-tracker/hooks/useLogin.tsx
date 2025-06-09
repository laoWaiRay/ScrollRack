import { useRouter } from "next/navigation";
import { api, schemas } from "@/generated/client";
import { useCallback } from "react";
import z from "zod";
import { useAuth } from "./useAuth";
import { ActionType } from "@/context/AuthContext";
import { AppError } from "@/errors";

type LoginRequest = z.infer<typeof schemas.LoginRequest>;

export function useLogin() {
	const router = useRouter();
  const { user, dispatch } = useAuth();
 
  async function _loginAsync(email: string, password: string) {
    let user = null;

    try {
      // On successful login, a session cookie is stored automatically on client
      const loginData: LoginRequest = { email, password };
      user = await api.postApiUserlogin(loginData, {
        withCredentials: true
      });
      
      dispatch!({ type: ActionType.LOGIN, payload: user });
      router.push("/commandzone");
    } catch (error) {
      throw new AppError("LOGIN_ERROR", "Invalid Username or Password");
    }
  }

  const loginAsync = useCallback(_loginAsync, []);
  
  return { loginAsync };
}
