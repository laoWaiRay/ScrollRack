"use server";

import { api } from "@/generated/client";
import { cookies } from "next/headers";

export async function getUserWithEmail() {
	const aspNetCoreIdentityCookieName = ".AspNetCore.Identity.Application";
	const cookieStore = await cookies();
	const cookie = cookieStore.get(aspNetCoreIdentityCookieName);

	if (cookie === undefined) {
		return null;
	}

	try {
		const user = await api.getApiUseremail({
			headers: {
				cookie: `${aspNetCoreIdentityCookieName}=${cookie.value}`,
			},
		});
		return user;
	} catch (error) {
		return null;
	}
}
