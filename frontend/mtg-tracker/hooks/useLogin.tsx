import { useRouter } from "next/navigation";
import { api, schemas } from "@/generated/client";
import { useCallback } from "react";
import z from "zod";

export function useLogin() {
	const router = useRouter();
  type LoginRequest = z.infer<typeof schemas.LoginRequest>;
 
  async function loginAsync(email: string, password: string) {
    let user = null;

    try {
      // On successful login, a session cookie is stored automatically on client
      const loginData: LoginRequest = { email, password };
      user = await api.postApiUserlogin(loginData, {
        withCredentials: true
      });
      
      // TODO: update the Auth Context with the user details
      console.log(`Successfully logged in: ${JSON.stringify(user)}`)
      router.push("/commandzone");
    } catch (error) {
      console.log(JSON.stringify(error));
      router.push("/login");
    }
  }

  const login = useCallback(loginAsync, []);
  
  return { login };
}
