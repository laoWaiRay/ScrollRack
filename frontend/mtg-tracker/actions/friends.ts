"use server";

import { api } from "@/generated/client";
import { callWithAuth } from "./helpers/callWithAuth";

export async function getFriends() {
	return await callWithAuth(api.getApiFrienddetailed);
}

export async function deleteFriend(friendId: string) {
	return await callWithAuth(api.deleteApiFriendId, undefined, {
		params: { id: friendId },
	});
}

export async function sendFriendRequest(username: string) {
	return await callWithAuth(api.postApiFriendRequestUserName, undefined, {
		params: { userName: username },
	});
}
