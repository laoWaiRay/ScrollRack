"use server";

import { api } from "@/generated/client";
import { callWithAuth } from "./helpers/callWithAuth";
import { DeckWriteDTO } from "@/types/client";

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

// Server actions should NEVER throw errors. Instead they return an AuthResult object
// that says whether or not the operation was successful. Need to change all try/catch to
// check the success attribute on the client to see if there is possibly an error to handle.

export async function getDecks() {
	return await callWithAuth(api.getApiDeck);
}

export async function createDeck(deckWriteDTO: DeckWriteDTO) {
	return await callWithAuth(api.postApiDeck, deckWriteDTO);
}

export async function editDeck(deckWriteDTO: DeckWriteDTO, deckId: number) {
	return await callWithAuth(api.putApiDeckId, deckWriteDTO, {
		params: { id: deckId },
	});
}

export async function deleteDeck(deckId: number) {
	return await callWithAuth(api.deleteApiDeckId, undefined, {
		params: { id: deckId },
	});
}

export async function getFriendDecks(friendId: string) {
	return await callWithAuth(api.getApiDeckfriendId, undefined, {
		params: { id: friendId },
	});
}
