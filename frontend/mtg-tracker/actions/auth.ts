"use server";

import { cookies } from "next/headers";

export async function setAuthCookies(
	accessToken: string,
	refreshToken: string
) {
	const cookieStore = await cookies();

	cookieStore.set("access_token", accessToken, {
		httpOnly: true,
		secure: true,
		sameSite: "lax",
		path: "/",
		maxAge: 60 * 60, // 1 hour
	});

	cookieStore.set("refresh_token", refreshToken, {
		httpOnly: true,
		secure: true,
		sameSite: "lax",
		path: "/",
		maxAge: 60 * 60 * 24 * 30, // 30 days
	});
  
  console.log(`Successfully Set Cookies`);
  console.log(`Access: ${accessToken}`);
  console.log(`Refresh: ${refreshToken}`);
}