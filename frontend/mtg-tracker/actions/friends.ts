"use server";

import { api } from "@/generated/client";
import { callWithAuth } from "./helpers/callWithAuth";

export async function getFriends() {
  return (await callWithAuth(api.getApiFrienddetailed) ?? []);
}
