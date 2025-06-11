"use server";

import { api } from "@/generated/client";
import { callWithAuth } from "./helpers/callWithAuth";

export async function getGameParticipations() {
  return await callWithAuth(api.getApiGameParticipation);
}