import { ReactNode } from "react";
import DashboardRootLayout from "./DashboardRootLayout";
import { FriendRequestProvider } from "@/context/FriendRequestContext";
import { FriendProvider } from "@/context/FriendContext";
import { getFriends } from "@/actions/friends";
import { getReceivedFriendRequests } from "@/actions/friendRequests";
import { RoomProvider } from "@/context/RoomContext";
import { getRooms } from "@/actions/rooms";
import { DeckProvider } from "@/context/DeckContext";
import { getDecks } from "@/actions/decks";
import { getGames } from "@/actions/games";
import { GameProvider } from "@/context/GameContext";
import { getGameParticipations } from "@/actions/gameParticipations";
import { GameParticipationProvider } from "@/context/GameParticipationContext";

export default async function layout({ children }: { children: ReactNode }) {
	const friends = await getFriends();
	const friendRequests = await getReceivedFriendRequests();
	const rooms = await getRooms();
	const decks = await getDecks();
	const games = await getGames();
	const gameParticipations = await getGameParticipations();

	return (
		<FriendProvider initialFriends={friends}>
			<FriendRequestProvider initialFriendRequests={friendRequests}>
				<RoomProvider initialRooms={rooms}>
					<DeckProvider initialDecks={decks}>
						<GameProvider initialGames={games}>
							<GameParticipationProvider initialGameParticipations={gameParticipations}>
								<DashboardRootLayout>{children}</DashboardRootLayout>
							</GameParticipationProvider>
						</GameProvider>
					</DeckProvider>
				</RoomProvider>
			</FriendRequestProvider>
		</FriendProvider>
	);
}
