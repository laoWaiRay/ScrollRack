"use server";

import { api } from "@/generated/client";
import { callWithAuth } from "./helpers/callWithAuth";

export async function getUserWithEmail() {
  return await callWithAuth(api.getApiUseremail);
}
