"use client";
import {
	DashboardLayout,
	DashboardHeader,
	DashboardMain,
} from "@/components/Dashboard";
import { useAuth } from "@/hooks/useAuth";
import { UserReadDTO } from "@/types/client";

interface CreatePodInterface {
	friends: UserReadDTO[] | null;
}

export default function CreatePod({ friends }: CreatePodInterface) {
	const { user } = useAuth();

	return (
		<DashboardLayout>
			<DashboardHeader title="Create Pod" user={user}></DashboardHeader>
			<DashboardMain>{JSON.stringify(friends, null, 3)}</DashboardMain>
		</DashboardLayout>
	);
}
