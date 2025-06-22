"use server";

import { api } from "@/generated/client";
import { callWithAuth } from "./helpers/callWithAuth";

export async function getGames() {
	return (await callWithAuth(api.getApiGame)) ?? [];
}
