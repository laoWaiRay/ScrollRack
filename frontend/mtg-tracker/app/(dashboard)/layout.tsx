import { ReactNode } from "react";
import DashboardRootLayout from "./DashboardRootLayout";
import { RoomProvider } from "@/context/RoomContext";
import {
  defaultGameState,
	GameProvider,
  GameState,
} from "@/context/GameContext";
import DatePickerProvider from "@/components/DatePickerProvider";
import MuiThemeProvider from "@/components/MuiThemeProvider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { getGames } from "@/actions/games";
import { getRooms } from "@/actions/rooms";

export default async function layout({ children }: { children: ReactNode }) {
	const initialRooms = (await getRooms()).data ?? [];
	const gameStateResult = await getGames();
	const initialGameState: GameState =
		gameStateResult.success && gameStateResult.data
			? gameStateResult.data
			: defaultGameState;

	return (
		<AppRouterCacheProvider>
			<MuiThemeProvider>
				<DatePickerProvider>
					<RoomProvider initialRooms={initialRooms}>
						<GameProvider initialGameState={initialGameState}>
							<DashboardRootLayout>{children}</DashboardRootLayout>
						</GameProvider>
					</RoomProvider>
				</DatePickerProvider>
			</MuiThemeProvider>
		</AppRouterCacheProvider>
	);
}
