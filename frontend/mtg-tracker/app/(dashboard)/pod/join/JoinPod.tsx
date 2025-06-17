"use client";
import {
	DashboardLayout,
	DashboardHeader,
	DashboardMain,
} from "@/components/Dashboard";
import { useAuth } from "@/hooks/useAuth";
import { useFriend } from "@/hooks/useFriend";

interface JoinPodInterface {
}

export default function JoinPod({}: JoinPodInterface) {
	const { user } = useAuth();
  const { friends } = useFriend();

	return (
		<DashboardLayout>
			<DashboardHeader title="Join Pod" user={user}></DashboardHeader>
			<DashboardMain>{JSON.stringify(friends, null, 3)}</DashboardMain>
		</DashboardLayout>
	);
}
