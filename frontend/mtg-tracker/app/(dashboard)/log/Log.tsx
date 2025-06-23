"use client";
import {
	DashboardLayout,
	DashboardHeader,
	DashboardMain,
} from "@/components/Dashboard";
import FilterSortBar from "@/components/FilterSortBar";
import { GameLogCard } from "@/components/GameLogCard";
import { useAuth } from "@/hooks/useAuth";
import { useGame } from "@/hooks/useGame";
import { useGameParticipation } from "@/hooks/useGameParticipation";
import Fuse from "fuse.js";
import { useEffect, useState } from "react";

interface LogInterface {}

export default function Log({}: LogInterface) {
	const { user } = useAuth();
	const { games, dispatch: dispatchGame } = useGame();
	const { gameParticipations, dispatch: dispatchGameParticipation } =
		useGameParticipation();
	const [filter, setFilter] = useState("");
	const [filtered, setFiltered] = useState(games);

	useEffect(() => {
		if (filter === "") {
			return;
		}

		const fuse = new Fuse(games, {
			keys: [
				{
					name: "commanderName",
					getFn: (game) =>
						game.gameParticipations?.find((gp) => gp.userId === user?.id)?.deck
							.commander ?? "",
				},
			],
		});

		setFiltered(fuse.search(filter).map((result) => result.item));
	}, [filter]);

	function renderLogs() {
		if (gameParticipations.length === 0) {
			return <div className="mt-4 w-full flex justify-center">No Games</div>;
		}

		if (filter !== "" && filtered.length > 0) {
			return filtered.map((data) => (
				<GameLogCard
					key={data.id}
					game={data}
					showButtons={true}
				/>
			));
		}

		return games.map((data) => (
			<GameLogCard
				key={data.id}
				game={data}
				showButtons={true}
			/>
		));
	}

	return (
		<DashboardLayout>
			<DashboardHeader title="Game Log" user={user}></DashboardHeader>
			<DashboardMain>
				<div className={`dashboard-main-content-layout max-w-lg lg:max-w-4xl`}>
					<div className="flex flex-col w-full gap-4">
						<FilterSortBar filter={filter} setFilter={setFilter} />

						<section className="w-full flex flex-col gap-2 lg:gap-4 px-2">
							{renderLogs()}
						</section>
					</div>
				</div>
			</DashboardMain>
		</DashboardLayout>
	);
}
