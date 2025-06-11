"use server";

import JoinPod from "./JoinPod";
import { getFriends } from "@/actions/friends";

export default async function page() {
	const friends = await getFriends();

	return <JoinPod friends={friends} />;
}
