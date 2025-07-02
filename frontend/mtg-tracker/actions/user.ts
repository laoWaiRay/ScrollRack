"use server";

import { api } from "@/generated/client";
import { UserLoginDTO } from "@/types/client";
import { setAuthCookies } from "./auth";
 
export async function login(loginDTO: UserLoginDTO) {
  try {
    const result = await api.postApiUserlogin(loginDTO); 
    const { userData, accessToken, refreshToken } = result;
    await setAuthCookies(accessToken, refreshToken);
    return userData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}