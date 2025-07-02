"use server";

import { api } from "@/generated/client";
import {
  ForgotPasswordRequestDTO,
	ResetPasswordRequestDTO,
	UserLoginDTO,
	UserRegisterDTO,
	UserWithEmailDTO,
	UserWriteDTO,
} from "@/types/client";
import { setAuthCookies } from "./auth";
import { callWithAuth } from "./helpers/callWithAuth";
import { isAxiosError } from "axios";
import { AuthResult } from "@/types/server";

export async function login(loginDTO: UserLoginDTO) {
	try {
		const data = await api.postApiUserlogin(loginDTO);
		const { userData, accessToken, refreshToken } = data;
		console.log(
			`User Is Authenticated: refresh: ${refreshToken}, access: ${accessToken}`
		);
		await setAuthCookies(accessToken, refreshToken);

		const result: AuthResult<UserWithEmailDTO> = {
			data: userData,
			success: true,
		};

		return result;
	} catch (error) {
		if (isAxiosError(error)) {
			const result: AuthResult<UserWithEmailDTO> = {
				success: false,
				error: {
					status: error.response?.status ?? 500,
					data: error.response?.data,
				},
			};
			return result;
		} else {
			throw error;
		}
	}
}

export async function updateUser(userWriteDTO: UserWriteDTO, id: string) {
	return await callWithAuth(api.putApiUserId, userWriteDTO, { params: { id } });
}

export async function sendVerifyEmailLink() {
	return await callWithAuth(api.postApiUserresendVerifyEmailLink);
}

export async function sendPasswordResetLink(requestDTO: ForgotPasswordRequestDTO) {
  return await callWithAuth(api.postApiUsersendPasswordReset, requestDTO);
}

export async function resetPassword(requestDTO: ResetPasswordRequestDTO) {
  return await callWithAuth(api.postApiUserresetPassword, requestDTO);
}

export async function registerUser(userRegisterDTO: UserRegisterDTO) {
	const authResult = await callWithAuth(
		api.postApiUserregister,
		userRegisterDTO
	);
	if (authResult.success && authResult.data) {
    const { accessToken, refreshToken } = authResult.data
    await setAuthCookies(accessToken, refreshToken);
	}

  const result: AuthResult<UserWithEmailDTO> = {
    success: true,
    data: authResult.data?.userData
  }

  return result;
}
