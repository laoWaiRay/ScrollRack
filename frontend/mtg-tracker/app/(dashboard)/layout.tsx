import { ReactNode } from "react";
import DashboardRootLayout from "./DashboardRootLayout";
import { FriendRequestProvider } from "@/context/FriendRequestContext";
import { FriendProvider } from "@/context/FriendContext";
import { getFriends } from "@/actions/friends";
import { getReceivedFriendRequests } from "@/actions/friendRequests";
import { RoomProvider } from "@/context/RoomContext";
import { getRooms } from "@/actions/rooms";

export default async function layout({ children }: { children: ReactNode }) {
	const friends = await getFriends();
	const friendRequests = await getReceivedFriendRequests();
	const rooms = await getRooms();

	return (
		<FriendProvider initialFriends={friends}>
			<FriendRequestProvider initialFriendRequests={friendRequests}>
				<RoomProvider initialRooms={rooms}>
					<DashboardRootLayout>{children}</DashboardRootLayout>
				</RoomProvider>
			</FriendRequestProvider>
		</FriendProvider>
	);
}
