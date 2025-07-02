"use server";

import { api } from "@/generated/client";
import { callWithAuth } from "./helpers/callWithAuth";
import { UserFriendAddDTO } from "@/types/client";

export async function getFriends() {
	return await callWithAuth(api.getApiFrienddetailed);
}

export async function addFriend(requestDTO: UserFriendAddDTO) {
  return await callWithAuth(api.postApiFriend, requestDTO);
}

export async function deleteFriend(friendId: string) {
	return await callWithAuth(api.deleteApiFriendId, undefined, {
		params: { id: friendId },
	});
}