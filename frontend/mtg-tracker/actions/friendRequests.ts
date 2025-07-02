"use server";

import { api } from "@/generated/client";
import { callWithAuth } from "./helpers/callWithAuth";
import { FriendRequestDTO, UserFriendAddDTO, UserMultipleDTO } from "@/types/client";

export async function getReceivedFriendRequestUsers() {
	const authResult = await callWithAuth(api.getApiFriendRequestreceived);

	if (authResult.success && authResult.data) {
		const receivedFriendRequests: FriendRequestDTO[] | null = authResult.data;

		if (receivedFriendRequests != null) {
			const userMultipleDTO: UserMultipleDTO = { ids: [] };

			receivedFriendRequests.forEach((request) => {
				userMultipleDTO.ids.push(request.senderId);
			});

			const userDataAuthResult = await callWithAuth(
				api.postApiUser,
				userMultipleDTO
			);

			return userDataAuthResult;
		}
    
    return { success: false };
	} else {
    return { success: false };
	}
}

export async function sendFriendRequest(username: string) {
	return await callWithAuth(api.postApiFriendRequestUserName, undefined, {
		params: { userName: username },
	});
}

export async function acceptFriendRequest(requestDTO: UserFriendAddDTO) {
  return await callWithAuth(api.postApiFriend, requestDTO);
}

export async function getReceivedFriendRequests() {
  return await callWithAuth(api.getApiFriendRequestreceived);
}

export async function deleteFriendRequest(id: number) {
  return await callWithAuth(api.deleteApiFriendRequestId, undefined, { params: { id } });
}

