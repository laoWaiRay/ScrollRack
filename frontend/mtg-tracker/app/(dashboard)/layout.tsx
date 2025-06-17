import { ReactNode } from "react";
import HomepageLayout from "./HomepageLayout";
import { FriendRequestProvider } from "@/context/FriendRequestContext";
import { FriendProvider } from "@/context/FriendContext";
import { getFriends } from "@/actions/friends";
import { getReceivedFriendRequests } from "@/actions/friendRequests";

export default async function layout({ children }: { children: ReactNode }) {
	const friends = (await getFriends()) ?? [];
	const friendRequests = (await getReceivedFriendRequests()) ?? [];

	return (
		<HomepageLayout>
			<FriendProvider initialFriends={friends}>
				<FriendRequestProvider initialFriendRequests={friendRequests}>
					{children}
				</FriendRequestProvider>
			</FriendProvider>
		</HomepageLayout>
	);
}
