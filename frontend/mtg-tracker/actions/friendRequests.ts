"use server";

import { api } from "@/generated/client";
import { callWithAuth } from "./helpers/callWithAuth";
import { FriendRequestDTO, UserMultipleDTO } from "@/types/client";

export async function getReceivedFriendRequests() {
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
