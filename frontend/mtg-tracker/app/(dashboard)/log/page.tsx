"use server";

import Log from "./Log";
import { getGameParticipations } from "@/actions/gameParticipations";

export default async function page() {
	const gameParticipations = await getGameParticipations();

	return <Log gameParticipations={gameParticipations} />;
}
