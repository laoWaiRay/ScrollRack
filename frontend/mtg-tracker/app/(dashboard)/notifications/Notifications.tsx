"use client";
import { useState } from "react";
import OptionsLayout from "@/components/OptionsLayout";
import FriendRequestCard from "@/components/FriendRequestCard";
import { useFriendRequest } from "@/hooks/useFriendRequest";

interface NotificationsInterface {}

export default function Notifications({}: NotificationsInterface) {
	const [enabled, setEnabled] = useState(false);
	const { friendRequests } = useFriendRequest();

	return (
		<OptionsLayout title={"Notifications"}>
			<h2 className="mb-2 self-center">NOTIFICATIONS</h2>
			<div className="flex justify-between px-2 w-full">
				<div className="flex flex-col gap-3 w-full">
					{friendRequests.length ? (
						friendRequests.map((request) => (
							<FriendRequestCard key={request.id} user={request} />
						))
					) : (
						<div className="flex py-4 justify-center rounded-lg w-full">
							No new notifications
						</div>
					)}
				</div>
			</div>
		</OptionsLayout>
	);
}
