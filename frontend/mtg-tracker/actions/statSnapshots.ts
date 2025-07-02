"use server";

import { api } from "@/generated/client";
import { callWithAuth } from "./helpers/callWithAuth";

// Get stat snapshots for current user
export async function getStatSnapshots() {
	return await callWithAuth(api.getApiStatSnapshot);
}
