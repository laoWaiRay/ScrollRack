"use client";
import {
	DashboardLayout,
	DashboardHeader,
	DashboardMain,
} from "@/components/Dashboard";
import { useAuth } from "@/hooks/useAuth";
import { useDeck } from "@/hooks/useDeck";
import { useGame } from "@/hooks/useGame";
import { useGameParticipation } from "@/hooks/useGameParticipation";

interface LogInterface {}

export default function Log({}: LogInterface) {
	const { user } = useAuth();
	const { games, dispatch: dispatchGame } = useGame();
	const { gameParticipations, dispatch: dispatchGameParticipation } =
		useGameParticipation();
	const { decks, dispatch: dispatchDeck } = useDeck();

	return (
		<DashboardLayout>
			<DashboardHeader title="Account" user={user}></DashboardHeader>
			<DashboardMain>
				<div className="flex flex-col">
					<div className="py-4">{JSON.stringify(games, null, 3)}</div>
					<div className="py-4">
						{JSON.stringify(gameParticipations, null, 3)}
					</div>
					<div className="py-4">{JSON.stringify(decks, null, 3)}</div>
				</div>
			</DashboardMain>
		</DashboardLayout>
	);
}
