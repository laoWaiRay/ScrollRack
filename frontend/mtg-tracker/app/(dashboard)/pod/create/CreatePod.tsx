"use client";
import {
	DashboardLayout,
	DashboardHeader,
	DashboardMain,
} from "@/components/Dashboard";
import { useAuth } from "@/hooks/useAuth";
import { useFriend } from "@/hooks/useFriend";

interface CreatePodInterface {
}

export default function CreatePod({}: CreatePodInterface) {
	const { user } = useAuth();
  const { friends, dispatch } = useFriend();

	return (
		<DashboardLayout>
			<DashboardHeader title="Create Pod" user={user}></DashboardHeader>
			<DashboardMain>{JSON.stringify(friends, null, 3)}</DashboardMain>
		</DashboardLayout>
	);
}
