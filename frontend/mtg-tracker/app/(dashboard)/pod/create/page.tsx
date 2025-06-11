"use server";

import CreatePod from "./CreatePod";
import { getFriends } from "@/actions/friends";

export default async function page() {
	const friends = await getFriends();

	return <CreatePod friends={friends} />;
}
