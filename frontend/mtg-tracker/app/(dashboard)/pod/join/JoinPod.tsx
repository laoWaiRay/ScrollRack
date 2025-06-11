"use client";
import {
	DashboardLayout,
	DashboardHeader,
	DashboardMain,
} from "@/components/Dashboard";
import { useAuth } from "@/hooks/useAuth";
import { UserReadDTO } from "@/types/client";

interface JoinPodInterface {
	friends: UserReadDTO[] | null;
}

export default function JoinPod({ friends }: JoinPodInterface) {
	const { user } = useAuth();

	return (
		<DashboardLayout>
			<DashboardHeader title="Join Pod" user={user}></DashboardHeader>
			<DashboardMain>{JSON.stringify(friends, null, 3)}</DashboardMain>
		</DashboardLayout>
	);
}
