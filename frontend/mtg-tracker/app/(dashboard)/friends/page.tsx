"use server";

import { getFriends } from "@/actions/friends";
import Friends from "./Friends";

export default async function page() {
	const friends = await getFriends();

	return <Friends friends={friends} />;
}
