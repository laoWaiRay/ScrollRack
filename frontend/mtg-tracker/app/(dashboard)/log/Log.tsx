"use client";
import {
	DashboardLayout,
	DashboardHeader,
	DashboardMain,
} from "@/components/Dashboard";
import { useAuth } from "@/hooks/useAuth";
import { GameParticipationReadDTO } from "@/types/client";

interface LogInterface {
	gameParticipations: GameParticipationReadDTO[] | null;
}

export default function Log({ gameParticipations }: LogInterface) {
	const { user } = useAuth();

	return (
		<DashboardLayout>
			<DashboardHeader title="Account" user={user}></DashboardHeader>
			<DashboardMain>
				{JSON.stringify(gameParticipations, null, 3)}
			</DashboardMain>
		</DashboardLayout>
	);
}
