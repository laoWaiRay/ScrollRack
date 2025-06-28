import { ReactNode } from "react";
import DashboardRootLayout from "./DashboardRootLayout";
import { FriendProvider } from "@/context/FriendContext";
import { getFriends } from "@/actions/friends";
import { RoomProvider } from "@/context/RoomContext";
import { getRooms } from "@/actions/rooms";
import { getGames } from "@/actions/games";
import { GameProvider } from "@/context/GameContext";
import { getGameParticipations } from "@/actions/gameParticipations";
import { GameParticipationProvider } from "@/context/GameParticipationContext";
import DatePickerProvider from "@/components/DatePickerProvider";
import MuiThemeProvider from "@/components/MuiThemeProvider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

export default async function layout({ children }: { children: ReactNode }) {
	const friends = await getFriends();
	const rooms = await getRooms();
	const gameState = await getGames();
	const gameParticipations = await getGameParticipations();

	return (
		<AppRouterCacheProvider>
			<MuiThemeProvider>
				<DatePickerProvider>
					<FriendProvider initialFriends={friends}>
						<RoomProvider initialRooms={rooms}>
							<GameProvider initialGameState={gameState}>
								<GameParticipationProvider
									initialGameParticipations={gameParticipations}
								>
									<DashboardRootLayout>{children}</DashboardRootLayout>
								</GameParticipationProvider>
							</GameProvider>
						</RoomProvider>
					</FriendProvider>
				</DatePickerProvider>
			</MuiThemeProvider>
		</AppRouterCacheProvider>
	);
}
