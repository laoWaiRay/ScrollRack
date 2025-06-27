import { schemas } from "@/generated/client";
import "client-only";
import { useState } from "react";

export function useLocalStorage<ValueT>(
	key: string
): [ValueT | null, (value: ValueT | null) => void] {
	const [state, setState] = useState<ValueT | null>(() => {
		if (typeof window == "undefined") {
			return null;
		}

		try {
			const value = window.localStorage.getItem(key);
			return value ? JSON.parse(value) : null;
		} catch (error) {
			console.log(error);
		}
	});

	const setValue = (value: ValueT | null) => {
		try {
			if (value) {
				window.localStorage.setItem(key, JSON.stringify(value));
				setState(value);
			} else {
				window.localStorage.removeItem(key);
				setState(null);
			}
		} catch (error) {
			console.log(error);
		}
	};

	return [state, setValue];
}

// Tries to find player ID and Deck data from localstorage
export function tryGetLocalStoragePlayerData(userId: string) {
	const playerDeckDataString = window.localStorage.getItem(userId);
	if (playerDeckDataString != null) {
		try {
			const playerDeckDataParsed: unknown = JSON.parse(playerDeckDataString);
			if (
				playerDeckDataParsed &&
				typeof playerDeckDataParsed === "object" &&
				"deckData" in playerDeckDataParsed &&
				"id" in playerDeckDataParsed &&
				typeof playerDeckDataParsed["id"] === "string"
			) {
				const playerId = playerDeckDataParsed["id"];
				const playerDeckData = schemas.DeckReadDTO.parse(
					playerDeckDataParsed["deckData"]
				);
        return { playerId, playerDeckData };
			} else {
				return null;
			}
		} catch (error) {
			console.log("Zod Error parsing DeckReadDTO", error);
      return null;
		}
	}

  return null;
}
