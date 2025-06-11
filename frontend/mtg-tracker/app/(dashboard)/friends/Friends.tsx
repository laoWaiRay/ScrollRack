"use client";
import {
	DashboardLayout,
	DashboardHeader,
	DashboardMain,
} from "@/components/Dashboard";
import { useAuth } from "@/hooks/useAuth";
import { UserReadDTO } from "@/types/client";

interface FriendsInterface {
	friends: UserReadDTO[] | null;
}

export default function Friends({ friends }: FriendsInterface) {
	const { user } = useAuth();

	return (
		<DashboardLayout>
			<DashboardHeader title="Friends" user={user}></DashboardHeader>
			<DashboardMain>{JSON.stringify(friends, null, 3)}</DashboardMain>
		</DashboardLayout>
	);
}
