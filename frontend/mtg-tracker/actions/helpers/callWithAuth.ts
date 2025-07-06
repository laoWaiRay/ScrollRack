"use server";

import { UNAUTHORIZED } from "@/constants/httpStatus";
import { api } from "@/generated/client";
import { isAccessTokenExpired } from "@/helpers/auth";
import { RefreshRequestDTO } from "@/types/client";
import { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { setAuthCookies } from "./auth";
import { AuthResult } from "@/types/server";

interface ConfigOptions {
	headers?: Record<string, string>;
	params?: Record<string, string | number | boolean | undefined>;
	queries?: Record<string, string | number | boolean | undefined>;
	[key: string]: any;
}

function genericErrorResponse<ReturnT>() {
	const response: AuthResult<ReturnT> = {
		success: false,
		error: {
			data: "Internal Server Error",
			status: 500,
		},
	};
	return response;
}

function unauthorizedErrorResponse<ReturnT>() {
	const response: AuthResult<ReturnT> = {
		success: false,
		error: {
			data: "Unauthorized",
			status: 401,
		},
	};
	return response;
}

export async function callWithAuth<ReturnT>(
	apiFn: (configOptions?: ConfigOptions) => Promise<ReturnT>
): Promise<AuthResult<ReturnT>>;

export async function callWithAuth<BodyT, ReturnT>(
	apiFn: (
		body: BodyT,
		configOptions?: ConfigOptions
	) => Promise<AuthResult<ReturnT> | null>,
	configOptions?: ConfigOptions
): Promise<AuthResult<ReturnT>>;

export async function callWithAuth<BodyT, ReturnT>(
	apiFn: (body: BodyT, configOptions?: ConfigOptions) => Promise<ReturnT>,
	body: BodyT
): Promise<AuthResult<ReturnT>>;

export async function callWithAuth<BodyT, ReturnT>(
	apiFn: (body?: any, configOptions?: any) => Promise<ReturnT>,
	body?: BodyT,
	configOptions?: ConfigOptions
): Promise<AuthResult<ReturnT>>;

export async function callWithAuth<ReturnT>(
	apiFn: any,
	body?: any,
	configOptions?: ConfigOptions
): Promise<AuthResult<ReturnT>> {
	const cookieStore = await cookies();
	let accessToken = cookieStore.get("access_token")?.value;
	let refreshToken = cookieStore.get("refresh_token")?.value;

	if (!refreshToken) {
		return genericErrorResponse();
	}

	// Refresh tokens if access token is expired
	if (!accessToken || isAccessTokenExpired(accessToken)) {
		const refreshRequest: RefreshRequestDTO = {
			refreshToken: refreshToken,
		};
		try {
			const refreshResponse = await api.postApiUserrefresh(refreshRequest);
			accessToken = refreshResponse.accessToken;
			refreshToken = refreshResponse.refreshToken;
			await setAuthCookies(accessToken, refreshToken);
		} catch (error) {
      console.log(error);
    }
	}

	try {
		const { headers, params, queries } = configOptions || {};
		const _configOptions = {
			params,
			queries,
			headers: {
				...(headers || {}),
				Authorization: `Bearer ${accessToken}`,
			},
		};

		let data: ReturnT | null = null;
		if (body === null || body === undefined) {
			if (apiFn.length === 1) {
				data = await apiFn(_configOptions);
			} else {
				data = await apiFn(undefined, _configOptions);
			}
		} else {
			data = await apiFn(body, _configOptions);
		}

		if (data == null) {
			console.log(`ERROR: No data`);
			return genericErrorResponse();
		}

		const response: AuthResult<ReturnT> = {
			data,
			success: true,
		};

		return response;
	} catch (error) {
		if (isAxiosError(error) && error.response?.status == UNAUTHORIZED) {
			return unauthorizedErrorResponse();
		}

		if (isAxiosError(error)) {
			const response: AuthResult<ReturnT> = {
				success: false,
				error: {
					status: error.response?.status ?? 500,
					data: error.response?.data,
				},
			};
			return response;
		}

		return genericErrorResponse();
	}
}
