"use server";

import { api } from "@/generated/client";
import { callWithAuth } from "./helpers/callWithAuth";

export async function getDecks() {
	return (await callWithAuth(api.getApiDeck)) ?? [];
}