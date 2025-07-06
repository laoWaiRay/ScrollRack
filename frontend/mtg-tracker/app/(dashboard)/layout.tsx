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
import { RoomDTO } from "@/types/client";
import { api } from "@/generated/client";
import { getAccessToken } from "@/actions/helpers/auth";

export default async function layout({ children }: { children: ReactNode }) {
	let initialRooms: RoomDTO[] = [];
	let initialGameState: GameState = defaultGameState;

	try {
    // Try to populate context data without setting cookies, since cookies cannot be set from
    // Server Components, only from Server Actions and Route Handlers.
		const token = await getAccessToken();
		const headers = {
			Authorization: `Bearer ${token}`,
		};
		initialRooms = await api.getApiRoom({
			headers,
		});

		const gameStateResponse = await api.getApiGame({ queries: { page: 0 }, headers });
    initialGameState = {
      games: gameStateResponse.items ?? [],
      hasMore: gameStateResponse.hasMore ?? false,
      page: gameStateResponse.page ?? 0
    };
	} catch (error) {
		console.log(error);
	}

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
