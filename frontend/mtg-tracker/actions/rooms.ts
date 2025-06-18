"use server";

import { api } from "@/generated/client";
import { callWithAuth } from "./helpers/callWithAuth";

export async function getRooms() {
	return (await callWithAuth(api.getApiRoom)) ?? [];
}
