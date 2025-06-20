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

export default async function layout({ children }: { children: ReactNode }) {
	const friends = await getFriends();
	const friendRequests = await getReceivedFriendRequests();
	const rooms = await getRooms();
  const decks = await getDecks();

	return (
		<FriendProvider initialFriends={friends}>
			<FriendRequestProvider initialFriendRequests={friendRequests}>
				<RoomProvider initialRooms={rooms}>
					<DeckProvider initialDecks={decks}>
						<DashboardRootLayout>{children}</DashboardRootLayout>
					</DeckProvider>
				</RoomProvider>
			</FriendRequestProvider>
		</FriendProvider>
	);
}
