"use server";

import { api } from "@/generated/client";
import { callWithAuth } from "./helpers/callWithAuth";
import {
	FriendRequestDTO,
	UserMultipleDTO,
} from "@/types/client";

export async function getReceivedFriendRequests() {
	try {
		const receivedFriendRequests: FriendRequestDTO[] | null =
			await callWithAuth(api.getApiFriendRequestreceived);
		if (receivedFriendRequests != null) {
			const userMultipleDTO: UserMultipleDTO = { ids: [] };
			receivedFriendRequests.forEach((request) => {
				userMultipleDTO.ids.push(request.senderId);
			});
			const userData = await callWithAuth(api.postApiUser, userMultipleDTO);
			return userData ?? [];
		}

		return [];
	} catch (error) {
		console.log(error);
		throw error;
	}
}