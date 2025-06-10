"use server";

import { UNAUTHORIZED } from "@/constants/httpStatus";
import { isAxiosError } from "axios";
import { cookies } from "next/headers";

const aspNetCoreIdentityCookieName = ".AspNetCore.Identity.Application";

export async function callWithAuth<ReturnT>(
	apiFn: (options: { header: Record<string, string> }) => Promise<ReturnT>
): Promise<ReturnT | null>;
export async function callWithAuth<BodyT, ReturnT>(
	apiFn: (
		body: BodyT,
		options: { header: Record<string, string> }
	) => Promise<ReturnT | null>
): Promise<ReturnT | null>;
export async function callWithAuth<ReturnT>(apiFn: any, body?: any): Promise<ReturnT | null> {
	const cookieStore = await cookies();
	const cookie = cookieStore.get(aspNetCoreIdentityCookieName);

	if (cookie == null) {
		return null;
	}

	try {
		if (body == null) {
			return await apiFn({
				headers: {
					cookie: `${aspNetCoreIdentityCookieName}=${cookie.value}`,
				},
			});
		}
		return await apiFn(body, {
			headers: {
				cookie: `${aspNetCoreIdentityCookieName}=${cookie.value}`,
			},
		});
	} catch (error) {
		if (isAxiosError(error) && error.response?.status == UNAUTHORIZED) {
			console.error(error);
			return null;
		}
		throw error;
	}
}
