// app/actions/getAccessToken.ts
"use server";
import { cookies } from "next/headers";

// Used because SignalR requires the token to start a connection
export async function getAccessToken(): Promise<string> {
	const token = (await cookies()).get("access_token")?.value;
	return token ?? "";
}
