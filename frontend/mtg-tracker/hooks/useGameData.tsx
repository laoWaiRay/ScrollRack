"use client"

import { GameData } from "@/app/(dashboard)/log/Log";
import { DeckReadDTO, GameParticipationReadDTO, GameReadDTO } from "@/types/client";
import { useMemo } from "react";

interface useGameDataInterface {
  games: GameReadDTO[]; 
  gameParticipations: GameParticipationReadDTO[];
  decks: DeckReadDTO[];
}

export default function useGameData({ games, gameParticipations, decks }: useGameDataInterface) {
	const gameData: GameData[] = useMemo(() => {
		return gameParticipations
			.map((gp) => {
				const game: GameReadDTO | undefined = games.find(
					(g) => g.id === gp.gameId
				);
				if (game && decks) {
					const deck = decks.find((d) => d.id === gp.deckId);
					if (!deck) {
						return null;
					}
					const combined: GameData = {
						gameId: game.id,
						gameParticipationId: gp.id,
						deck,
						won: gp.won,
						winner: game.winner,
						numPlayers: game.numPlayers,
						seconds: game.seconds,
						createdAt: game.createdAt,
						createdByUserId: game.createdByUserId,
					};
					return combined;
				} else {
					return null;
				}
			})
			.filter((result) => result !== null);
	}, [gameParticipations]);
  
  return { gameData };
}
