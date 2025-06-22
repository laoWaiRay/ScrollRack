"use client";
import {
	DashboardLayout,
	DashboardHeader,
	DashboardMain,
} from "@/components/Dashboard";
import FilterSortBar from "@/components/FilterSortBar";
import { GameLogCard } from "@/components/GameLogCard";
import { useAuth } from "@/hooks/useAuth";
import { useDeck } from "@/hooks/useDeck";
import { useGame } from "@/hooks/useGame";
import { useGameParticipation } from "@/hooks/useGameParticipation";
import { DeckReadDTO, GameReadDTO, UserReadDTO } from "@/types/client";
import Fuse from "fuse.js";
import { useEffect, useMemo, useState } from "react";

export interface GameData {
	gameId: number;
	gameParticipationId: string;
	deck: DeckReadDTO;
	won: boolean;
	winner: UserReadDTO | undefined;
	numPlayers: number;
	seconds: number;
	createdAt: string;
	createdByUserId: string | null | undefined;
}

interface LogInterface {}

export default function Log({}: LogInterface) {
	const { user } = useAuth();
	const { games, dispatch: dispatchGame } = useGame();
	const { gameParticipations, dispatch: dispatchGameParticipation } =
		useGameParticipation();
	const { decks, dispatch: dispatchDeck } = useDeck();
	const [filter, setFilter] = useState("");

	const gameData: GameData[] = useMemo(() => {
		return gameParticipations
			.map((gp) => {
				const game: GameReadDTO | undefined = games.find(
					(g) => g.id === gp.gameId
				);
				if (game) {
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

	const [filtered, setFiltered] = useState(gameData);

	useEffect(() => {
		if (filter === "") {
			return;
		}

		const fuse = new Fuse(gameData, {
			keys: ["deck.commander"],
		});

		setFiltered(fuse.search(filter).map((result) => result.item));
	}, [filter]);

	function renderLogs() {
		if (gameParticipations.length === 0) {
			return <div className="mt-4 w-full flex justify-center">No Games</div>;
		}

		if (filter !== "" && filtered.length > 0) {
			return filtered.map((data) => (
				<GameLogCard gameData={data} key={data.gameParticipationId} />
			));
		}

		return gameData.map((data) => (
			<GameLogCard gameData={data} key={data.gameParticipationId} />
		));
	}
  
  async function handleDeleteGame() {

  }

	return (
		<DashboardLayout>
			<DashboardHeader title="Game Log" user={user}></DashboardHeader>
			<DashboardMain>
				<div className={`dashboard-main-content-layout max-w-lg lg:max-w-4xl`}>
					<div className="flex flex-col w-full gap-4">
						<FilterSortBar filter={filter} setFilter={setFilter} />

						<section className="w-full flex flex-col gap-2 px-2">
							{renderLogs()}
						</section>
					</div>
				</div>
			</DashboardMain>
		</DashboardLayout>
	);
}
