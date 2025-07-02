"use server";

import { api } from "@/generated/client";
import { callWithAuth } from "./helpers/callWithAuth";
import { GameParticipationWriteDTO } from "@/types/client";

export async function getGameParticipations() {
	return await callWithAuth(api.getApiGameParticipation);
}

export async function postGameParticipation(
	requestDTO: GameParticipationWriteDTO
) {
	return await callWithAuth(api.postApiGameParticipation, requestDTO, {
		queries: { imported: true },
	});
}
