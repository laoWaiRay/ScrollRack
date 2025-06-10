"use server";

import { api } from "@/generated/client";
import { callWithAuth } from "./helpers/callWithAuth";

// Get stat snapshot for current user
export async function getStatSnapshot() {
  return await callWithAuth(api.getApiStatSnapshot);
}