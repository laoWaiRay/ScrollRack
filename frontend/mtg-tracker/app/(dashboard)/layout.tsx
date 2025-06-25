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
import DatePickerProvider from "@/components/DatePickerProvider";
import MuiThemeProvider from "@/components/MuiThemeProvider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { getStatSnapshot } from "@/actions/statSnapshots";
import { SnapshotProvider } from "@/context/StatSnapshotContext";

export default async function layout({ children }: { children: ReactNode }) {
	const friends = await getFriends();
	const friendRequests = await getReceivedFriendRequests();
	const rooms = await getRooms();
	const decks = await getDecks();
	const gameState = await getGames();
	const gameParticipations = await getGameParticipations();
	const statSnapshot = await getStatSnapshot();

	return (
		<AppRouterCacheProvider>
			<MuiThemeProvider>
				<DatePickerProvider>
					<FriendProvider initialFriends={friends}>
						<FriendRequestProvider initialFriendRequests={friendRequests}>
							<RoomProvider initialRooms={rooms}>
								<DeckProvider initialDecks={decks}>
									<GameProvider initialGameState={gameState}>
										<GameParticipationProvider
											initialGameParticipations={gameParticipations}
										>
											<SnapshotProvider initialSnapshot={statSnapshot}>
												<DashboardRootLayout>{children}</DashboardRootLayout>
											</SnapshotProvider>
										</GameParticipationProvider>
									</GameProvider>
								</DeckProvider>
							</RoomProvider>
						</FriendRequestProvider>
					</FriendProvider>
				</DatePickerProvider>
			</MuiThemeProvider>
		</AppRouterCacheProvider>
	);
}
