"use server";

import { getFriends } from "@/actions/friends";
import AddFriends from "./AddFriends";

export default async function page() {
	const friends = await getFriends();

	return <AddFriends friends={friends} />;
}
