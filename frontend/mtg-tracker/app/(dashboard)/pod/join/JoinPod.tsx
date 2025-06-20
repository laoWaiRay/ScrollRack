"use client";
import ButtonIcon from "@/components/ButtonIcon";
import ButtonPrimary from "@/components/ButtonPrimary";
import {
	DashboardLayout,
	DashboardHeader,
	DashboardMain,
} from "@/components/Dashboard";
import RoomCodeInput from "@/components/RoomCodeInput";
import { api } from "@/generated/client";
import { useAuth } from "@/hooks/useAuth";
import { useRoom } from "@/hooks/useRoom";
import useToast from "@/hooks/useToast";
import Exit from "@/public/icons/exit.svg";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { CONFLICT, NOT_FOUND } from "@/constants/httpStatus";
import { ActionType } from "@/context/RoomContext";
import Dialog from "@/components/Dialog";
import { useRoomConnection } from "@/hooks/useRoomConnection";
import { HubConnection } from "@microsoft/signalr";
import { getRooms } from "@/actions/rooms";

interface JoinPodInterface {}

export default function JoinPod({}: JoinPodInterface) {
	const { toast } = useToast();
	const { user } = useAuth();
	const { rooms, dispatch } = useRoom();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [roomCode, setRoomCode] = useState(Array(6).fill(""));
	const router = useRouter();

	const hostedRoom = rooms.find((r) => r.roomOwnerId === user?.id);
	const joinedRoom = rooms.find(
		(r) =>
			user &&
			r.roomOwnerId !== user.id &&
			r.players?.find((player) => player.id === user.id)
	);

	const handleReceivePlayerAdd = async () => {
		const updatedRooms = await getRooms();
		dispatch({ type: ActionType.UPDATE, payload: updatedRooms });
	};

	const handleReceivePlayerRemove = async () => {
		const updatedRooms = await getRooms();
		dispatch({ type: ActionType.UPDATE, payload: updatedRooms });
	};

	const handleReceiveCloseRoom = async () => {
		const updatedRooms = await getRooms();
		dispatch({ type: ActionType.UPDATE, payload: updatedRooms });
	};

	const { connectionRef } = useRoomConnection(joinedRoom?.code ?? null, {
		handleReceivePlayerAdd,
		handleReceivePlayerRemove,
		handleReceiveCloseRoom,
	});

	async function handleJoin() {
		if (hostedRoom || joinedRoom) {
			toast("Already in a pod", "warn");
			return;
		}

		try {
			const room = await api.postApiRoomRoomCode(undefined, {
				params: { roomCode: roomCode.join("") },
				withCredentials: true,
			});
			dispatch({ type: ActionType.UPDATE, payload: [room] });
			toast("Joined pod", "success");
		} catch (error) {
			if (isAxiosError(error)) {
				if (error.response?.status === NOT_FOUND) {
					toast("Pod not found", "warn");
					return;
				} else if (error.response?.status === CONFLICT) {
					toast("Already joined pod", "warn");
					return;
				}
			}
			toast("Error joining pod", "warn");
		}
	}

	async function handleLeaveRoom() {
		if (rooms.length === 0 || !joinedRoom) {
			toast("Already left pod", "warn");
			return;
		}

		try {
			if (connectionRef.current) {
				await connectionRef.current.invoke("playerLeave", joinedRoom.code);
			} else {
				console.log("ERROR: NO CONNECTION REF");
			}
			await api.deleteApiRoom(undefined, { withCredentials: true });
			dispatch({ type: ActionType.UPDATE, payload: [] });
		} catch (error) {
			toast("Error leaving pod", "warn");
		}
	}

	return (
		<DashboardLayout>
			<DashboardHeader title="Join Pod" user={user} align="left">
				<ButtonIcon
					styles={`size-[2em] active:text-white hover:text-white ${
						!joinedRoom && "hidden"
					}`}
					onClick={() => setIsDialogOpen(true)}
				>
					<Exit />
				</ButtonIcon>
			</DashboardHeader>
			<DashboardMain>
				{hostedRoom ? (
					<div className="flex flex-col gap-2">
						<div className="text-base mt-4">
							Cannot join a pod while currently hosting one
						</div>

						<div className="w-fit self-center">
							<ButtonPrimary
								onClick={() => router.push("/pod/create")}
								uppercase={false}
							>
								Go to Hosted Pod
							</ButtonPrimary>
						</div>
					</div>
				) : joinedRoom ? (
					<>
						{/* Warning Modal for Leaving Room */}
						<Dialog
							title="Leave Pod"
							description="Remember to save any in progress games before leaving."
							isDialogOpen={isDialogOpen}
							setIsDialogOpen={setIsDialogOpen}
							onConfirm={() => handleLeaveRoom()}
						/>
						<div>
							<div className="flex flex-col items-center mb-2 mt-6">
								<span className="text-xl">Joined Pod:</span>
								<span className="text-xl uppercase font-bold tracking-wide text-white px-3 py-3 bg-primary-400 rounded-xl my-2">
									{joinedRoom.code.slice(0, 3) + " " + joinedRoom.code.slice(3)}
								</span>
							</div>
						</div>
					</>
				) : (
					<div className="flex flex-col gap-4 mt-4">
						<h3 className="text-xl">Enter Room Code</h3>
						<RoomCodeInput
							roomCode={roomCode}
							setRoomCode={setRoomCode}
							onSubmit={() => handleJoin()}
						/>
						<div className="mt-2 flex w-full justify-center items-center gap-4 px-8 max-w-sm">
							<ButtonPrimary onClick={handleJoin} style="primary" uppercase={false}>
								Join Pod
							</ButtonPrimary>
						</div>
					</div>
				)}
			</DashboardMain>
		</DashboardLayout>
	);
}
