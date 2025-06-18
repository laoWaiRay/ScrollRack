"use client";
import ComboBox from "@/components/ComboBox";
import {
	DashboardLayout,
	DashboardHeader,
	DashboardMain,
} from "@/components/Dashboard";
import { useAuth } from "@/hooks/useAuth";
import { useFriend } from "@/hooks/useFriend";
import { UserReadDTO } from "@/types/client";
import { useState } from "react";

export default function Friends() {
	const { user } = useAuth();
  const { friends } = useFriend();
	const [selected, setSelected] = useState<UserReadDTO | null>(null);
	const [query, setQuery] = useState("");

	return (
		<DashboardLayout>
			<DashboardHeader
				title="Friends"
				user={user}
			></DashboardHeader>
			<DashboardMain>
				<div>
					<ComboBox
						list={friends}
						query={query}
						setQuery={setQuery}
						selected={selected}
						setSelected={setSelected}
					/>
				</div>
			</DashboardMain>
		</DashboardLayout>
	);
}
