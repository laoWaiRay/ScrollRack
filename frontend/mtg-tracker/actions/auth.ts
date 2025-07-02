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
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
}

export async function getRefreshToken() {
  const cookieStore = await cookies();
  return cookieStore.get("refresh_token")?.value;
}