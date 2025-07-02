"use server";

import { api } from "@/generated/client";
import { callWithAuth } from "./helpers/callWithAuth";
import { GameState } from "@/context/GameContext";
import { AuthResult } from "@/types/server";

// startDate and endDate should be ISO date strings
export async function getGames(
	page: number = 0,
	startDate?: string,
	endDate?: string
): Promise<AuthResult<GameState>> {
	const authResult = await callWithAuth(api.getApiGame, undefined, {
		queries: { page, startDate, endDate },
	});

	if (authResult.success && authResult.data) {
		const data: GameState = {
			games: authResult.data.items ?? [],
			page: authResult.data.page ?? 0,
			hasMore: authResult.data.hasMore ?? false,
		};

		return {
			success: true,
			data,
		};
	}

  return {
    success: false,
    error: authResult.error
  }
}
