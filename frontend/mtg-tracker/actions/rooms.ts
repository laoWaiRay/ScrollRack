"use server";

import { api } from "@/generated/client";
import { callWithAuth } from "./helpers/callWithAuth";
import { AddPlayerDTO } from "@/types/client";

export async function getRooms() {
	return await callWithAuth(api.getApiRoom);
}

export async function postRoom() {
	return await callWithAuth(api.postApiRoom, undefined);
}

export async function deleteRoom() {
	return await callWithAuth(api.deleteApiRoom, undefined);
}

export async function joinRoom(roomCode: string) {
	return await callWithAuth(api.postApiRoomRoomCode, undefined, {
		params: { roomCode },
	});
}

export async function addPlayerToRoom(
	addPlayerDTO: AddPlayerDTO,
	roomCode: string
) {
	return await callWithAuth(api.postApiRoomRoomCodeplayers, addPlayerDTO, {
		params: { roomCode },
	});
}

export async function removePlayerFromRoom(id: string, roomCode: string) {
	return await callWithAuth(api.deleteApiRoomRoomCodeplayersId, undefined, {
		params: {
			id,
			roomCode,
		},
	});
}
