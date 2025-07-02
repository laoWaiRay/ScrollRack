"use server";

import { UNAUTHORIZED } from "@/constants/httpStatus";
import { api } from "@/generated/client";
import { isAccessTokenExpired } from "@/helpers/auth";
import { RefreshRequestDTO } from "@/types/client";
import { isAxiosError } from "axios";
import { cookies } from "next/headers";
import { setAuthCookies } from "../auth";

export interface AuthResult<ReturnT> {
  data: ReturnT;
  accessToken: string;
  refreshToken: string;
}

interface ConfigOptions {
  headers?: Record<string, string>;
  params?: Record<string, string>;
  queries?: Record<string, string | number | undefined>;
  [key: string]: any;
}

export async function callWithAuth<ReturnT>(
	apiFn: (configOptions?: ConfigOptions) => Promise<ReturnT>
): Promise<ReturnT | null>;

export async function callWithAuth<BodyT, ReturnT>(
	apiFn: (
		body: BodyT,
		configOptions?: ConfigOptions,
	) => Promise<AuthResult<ReturnT> | null>,
	configOptions?: ConfigOptions,
): Promise<ReturnT | null>;

export async function callWithAuth<BodyT, ReturnT>(
	apiFn: (
		body: BodyT,
		configOptions?: ConfigOptions,
	) => Promise<ReturnT>,
	body: BodyT
): Promise<ReturnT | null>;

export async function callWithAuth<BodyT, ReturnT>(
	apiFn: (
		body?: BodyT,
		configOptions?: ConfigOptions,
	) => Promise<ReturnT>,
	body?: BodyT,
	configOptions?: ConfigOptions,
): Promise<ReturnT | null>;

export async function callWithAuth<ReturnT>(
	apiFn: any,
	body?: any,
	configOptions?: ConfigOptions
): Promise<ReturnT | null> {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get("access_token")?.value;
  let refreshToken = cookieStore.get("refresh_token")?.value;
  
  if (!refreshToken || !accessToken) {
    return null;
  }
  
  // Refresh tokens if access token is expired
  if (isAccessTokenExpired(accessToken)) {
    const refreshRequest: RefreshRequestDTO = {
      refreshToken: refreshToken
    };
    try {
      const refreshResponse = await api.postApiUserrefresh(refreshRequest);
      accessToken = refreshResponse.accessToken;
      refreshToken = refreshResponse.refreshToken;
      await setAuthCookies(accessToken, refreshToken);
    } catch (error) {
      console.error(error);
    }
  }
  
	try {
    const {headers, params, queries} = configOptions || {};
		const _configOptions = {
      params,
      queries,
			headers: {
        ...(headers || {}),
        "Authorization": `Bearer ${accessToken}`
			},
		};
    
    let data: ReturnT | null = null;
		if (body == null) {
			data = await apiFn(_configOptions);
		} else {
			data = await apiFn(body, _configOptions);
		}
    
    if (data == null) {
      return null; 
    }
    
    return data;
	} catch (error) {
		if (isAxiosError(error) && error.response?.status == UNAUTHORIZED) {
			return null;
		}
		throw error;
	}
}
