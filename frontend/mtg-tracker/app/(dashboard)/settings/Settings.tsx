"use client";
import {
	DashboardLayout,
	DashboardHeader,
	DashboardMain,
} from "@/components/Dashboard";
import { useAuth } from "@/hooks/useAuth";

export default function Account() {
	const { user } = useAuth();

	return (
		<DashboardLayout>
			<DashboardHeader title="Settings" user={user}></DashboardHeader>
			<DashboardMain>
        "SETTINGS"
			</DashboardMain>
		</DashboardLayout>
	);
}
