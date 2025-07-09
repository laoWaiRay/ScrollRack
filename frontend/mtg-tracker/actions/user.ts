"use server";

import { api } from "@/generated/client";
import {
	ForgotPasswordRequestDTO,
	LogoutRequestDTO,
	RefreshRequestDTO,
	RefreshResponseDTO,
	ResetPasswordRequestDTO,
	UserLoginDTO,
	UserRegisterDTO,
	UserWithEmailDTO,
	UserWriteDTO,
} from "@/types/client";
import {
	clearAuthCookies,
	getRefreshToken,
	setAuthCookies,
} from "./helpers/auth";
import { callWithAuth } from "./helpers/callWithAuth";
import { isAxiosError } from "axios";
import { AuthResult } from "@/types/server";
import { UNAUTHORIZED } from "@/constants/httpStatus";

export async function login(loginDTO: UserLoginDTO) {
	try {
		const data = await api.postApiUserlogin(loginDTO);
		const { userData, accessToken, refreshToken } = data;
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

export async function logout() {
	const refreshToken = await getRefreshToken();
	if (refreshToken) {
		const logoutRequestDTO: LogoutRequestDTO = {
			refreshToken: refreshToken,
		};
		await callWithAuth(api.postApiUserlogout, logoutRequestDTO);
	}
	await clearAuthCookies();
}

export async function updateUser(userWriteDTO: UserWriteDTO, id: string) {
	return await callWithAuth(api.putApiUserId, userWriteDTO, { params: { id } });
}

export async function sendVerifyEmailLink() {
	return await callWithAuth(api.postApiUserresendVerifyEmailLink);
}

export async function sendPasswordResetLink(
	requestDTO: ForgotPasswordRequestDTO
) {
	try {
		await api.postApiUsersendPasswordReset(requestDTO);
		const result: AuthResult<never> = {
			success: true,
		};
		return result;
	} catch (error) {
		if (isAxiosError(error)) {
			const result: AuthResult<never> = {
				success: false,
				error: {
					data: error.response?.data,
					status: error.response?.status ?? 500,
				},
			};
			return result;
		}
		return {
			success: false,
			error: {
				status: 500,
				data: "Server Error",
			},
		};
	}
}

export async function resetPassword(requestDTO: ResetPasswordRequestDTO) {
	try {
		await api.postApiUserresetPassword(requestDTO);
		const result: AuthResult<never> = {
			success: true,
		};
		return result;
	} catch (error) {
		if (isAxiosError(error)) {
			const result: AuthResult<never> = {
				success: false,
				error: {
					status: error.response?.status ?? 500,
					data: error.response?.data,
				},
			};
			return result;
		}
		return {
			success: false,
			error: {
				status: 500,
				data: "Server Error",
			},
		};
	}
}

export async function registerUser(userRegisterDTO: UserRegisterDTO) {
	try {
		const authResult = await api.postApiUserregister(userRegisterDTO);
		const { accessToken, refreshToken } = authResult;
		await setAuthCookies(accessToken, refreshToken);
		const result: AuthResult<UserWithEmailDTO> = {
			success: true,
			data: authResult.userData,
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
		}
		return {
			success: false,
			error: {
				status: 500,
				data: "Server Error",
			},
		};
	}
}

// Throws an error if refresh fails
export async function tryRefreshTokens(retryCount = 4) {
	const refreshToken = await getRefreshToken();

	if (!refreshToken) {
		throw Error("No refresh token found");
	}

	const refreshRequest: RefreshRequestDTO = {
		refreshToken,
	};
  
  try {
    const response = await api.postApiUserrefresh(refreshRequest);
    const { accessToken, refreshToken: newRefreshToken, userData } = response;
    await setAuthCookies(accessToken, newRefreshToken);
    return userData;
  } catch (error) {
    // Retry in case of Azure / Neon servers being down due to cold starts
    if (isAxiosError(error) && error.response?.status !== UNAUTHORIZED && retryCount > 0) {
      console.log(`Retry attempt: ${retryCount}`)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return tryRefreshTokens(retryCount - 1);
    } else {
      throw error;  
    }
  }
}
