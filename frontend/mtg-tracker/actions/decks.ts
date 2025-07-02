"use server";

import { api } from "@/generated/client";
import { callWithAuth } from "./helpers/callWithAuth";

/*
 * Login Logic
 * User initiates login
 *  Success => Server puts tokens into cookies, Client gets user data
 *  Fail => Client gets error
*/

/*
 * API Call Logic
 * Client refresh =>
 *  Attempt Server Action to fetch user data
 *    Success => Server sets refresh/access tokens in cookies, and returns user data
 *    Fail => Server returns null, refreshes tokens and saves in cookies if necessary
 *  Client gets server response
 *    Success => now has user data
 *    Fail => redirect to "/login"
*/

export async function getDecks() {
	return (await callWithAuth(api.getApiDeck)) ?? [];
}