"use server";

import { UNAUTHORIZED } from "@/constants/httpStatus";
import { isAxiosError } from "axios";
import { cookies } from "next/headers";

const aspNetCoreIdentityCookieName = ".AspNetCore.Identity.Application";

export async function callWithAuth<ReturnT>(
	apiFn: (configOptions?: {
		headers?: Record<string, string>;
		params?: Record<string, string>;
	}) => Promise<ReturnT>
): Promise<ReturnT | null>;

export async function callWithAuth<BodyT, ReturnT>(
	apiFn: (
		body: BodyT,
		configOptions?: any,
	) => Promise<ReturnT | null>,
	body: BodyT
): Promise<ReturnT | null>;

export async function callWithAuth<BodyT, ReturnT>(
	apiFn: (
		body?: BodyT,
		configOptions?: any,
	) => Promise<ReturnT | null>,
	body?: BodyT,
	configOptions?: { 
    headers?: Record<string, string>;
    params?: Record<string, string>;
  }
): Promise<ReturnT | null>;

export async function callWithAuth<ReturnT>(
	apiFn: any,
	body?: any,
	configOptions?: any
): Promise<ReturnT | null> {
	const cookieStore = await cookies();
	const cookie = cookieStore.get(aspNetCoreIdentityCookieName);

	if (cookie == null) {
		return null;
	}

	try {
    const {headers, params} = configOptions || {};
		const _configOptions = {
      params,
			headers: {
        ...(headers || {}),
				cookie: `${aspNetCoreIdentityCookieName}=${cookie.value}`,
			},
		};
		if (body == null || !body) {
			return await apiFn(_configOptions);
		} else if (configOptions == null) {
			return await apiFn(body, _configOptions);
		}
	} catch (error) {
		if (isAxiosError(error) && error.response?.status == UNAUTHORIZED) {
			return null;
		}
		throw error;
	}

	return null;
}
