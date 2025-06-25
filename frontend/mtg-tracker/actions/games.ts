"use server";

import { api } from "@/generated/client";
import { callWithAuth } from "./helpers/callWithAuth";
import { GameState } from "@/context/GameContext";

// startDate and endDate should be ISO date strings
export async function getGames(page: number = 0, startDate?: string, endDate?: string): Promise<GameState> {
	const result = await callWithAuth(api.getApiGame, undefined, { queries: { page, startDate, endDate } });

	return {
		games: result?.items ?? [],
		page: result?.page ?? 0,
		hasMore: result?.hasMore ?? false,
	};
}
