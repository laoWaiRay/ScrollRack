"use client";
import ButtonIcon from "@/components/ButtonIcon";
import ButtonPrimary from "@/components/ButtonPrimary";
import ComboBox from "@/components/ComboBox";
import {
	DashboardLayout,
	DashboardHeader,
	DashboardMain,
} from "@/components/Dashboard";
import UserCard from "@/components/UserCard";
import { ActionType } from "@/context/RoomContext";
import { api } from "@/generated/client";
import { useAuth } from "@/hooks/useAuth";
import { useFriend } from "@/hooks/useFriend";
import { useRoom } from "@/hooks/useRoom";
import useToast from "@/hooks/useToast";
import UserRemove from "@/public/icons/user-remove.svg";
import UserAdd from "@/public/icons/user-add.svg";
import Exit from "@/public/icons/exit.svg";
import { AddPlayerDTO, RoomDTO, UserReadDTO } from "@/types/client";
import { useState } from "react";
import Dialog from "@/components/Dialog";
import { useRouter } from "next/navigation";
import { useRoomConnection } from "@/hooks/useRoomConnection";
import { getRooms } from "@/actions/rooms";
import { HubConnection, HubConnectionState } from "@microsoft/signalr";

interface CreatePodInterface {}

export default function CreatePod({}: CreatePodInterface) {
	const { toast } = useToast();
	const { user } = useAuth();
	const { friends } = useFriend();
	const { rooms, dispatch } = useRoom();
	const [selected, setSelected] = useState<UserReadDTO | null>(null);
	const [query, setQuery] = useState("");
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const router = useRouter();
	const hostedRoom = rooms.find((r) => r.roomOwnerId === user?.id);

	const handleReceiveUpdateRoom = (room: RoomDTO) => {
		dispatch({ type: ActionType.UPDATE, payload: [room] });
	};

	const handleReceivePlayerJoin = async (conn: HubConnection | null) => {
		console.log("received player join");
		const updatedRoom = (await getRooms()).find(
			(r) => r.code === hostedRoom?.code
		);
		if (updatedRoom && conn?.state === HubConnectionState.Connected) {
			await conn?.invoke("updateRoom", updatedRoom.code, updatedRoom);
		}
	};

	const handleReceivePlayerLeave = async (conn: HubConnection | null) => {
		const updatedRoom = (await getRooms()).find(
			(r) => r.code === hostedRoom?.code
		);
		if (updatedRoom && conn?.state === HubConnectionState.Connected) {
			await conn?.invoke("updateRoom", updatedRoom.code, updatedRoom);
		}
	};

	const { connectionRef } = useRoomConnection(hostedRoom?.code ?? null, {
		handleReceiveUpdateRoom,
		handleReceivePlayerJoin,
		handleReceivePlayerLeave,
	});

	async function handleCreateRoom() {
		try {
			await api.postApiRoom(undefined, { withCredentials: true });
			const rooms = await api.getApiRoom({ withCredentials: true });
			const room = rooms.find((r) => r.roomOwnerId === user?.id);
			if (!room) {
				toast("Error creating pod", "warn");
			} else {
				dispatch({ type: ActionType.UPDATE, payload: rooms });
			}
		} catch (error) {
			console.log(error);
			toast(JSON.stringify(error), "warn");
		}
	}

	async function handleLeaveRoom() {
		if (rooms.length === 0 || !hostedRoom) {
			toast("Already closed pod", "warn");
			return;
		}

		try {
			await api.deleteApiRoom(undefined, { withCredentials: true });
			if (connectionRef.current) {
				connectionRef.current.invoke("closeRoom", hostedRoom.code);
			} else {
				console.log("ERROR: NO CONNECTION REF");
			}
			dispatch({ type: ActionType.UPDATE, payload: [] });
		} catch (error) {
			toast("Error closing pod", "warn");
		}
	}

	async function handleAddPlayer() {
		if (!hostedRoom) {
			toast("Error adding friend", "warn");
			return;
		}

		const friend = friends.find((f) => f === selected);
		if (!friend) {
			toast("Error adding friend", "warn");
			return;
		}

		try {
			const addPlayerDTO: AddPlayerDTO = { id: friend.id };
			const updatedRoom = await api.postApiRoomRoomCodeplayers(addPlayerDTO, {
				params: { roomCode: hostedRoom.code },
				withCredentials: true,
			});

			dispatch({ type: ActionType.UPDATE, payload: [updatedRoom] });

			if (connectionRef.current) {
				await connectionRef.current.invoke(
					"playerAdd",
					friend.id,
					hostedRoom.code
				);
			} else {
				console.log("ERROR: NO CONNECTION REF");
			}
		} catch (error) {
			console.log(error);
			toast("Error adding friend", "warn");
		}
	}

	async function handleRemovePlayer(id: string) {
		if (!hostedRoom) {
			toast("Error removing player", "warn");
			return;
		}

		try {
			const updatedRoom = await api.deleteApiRoomRoomCodeplayersId(undefined, {
				params: { id, roomCode: hostedRoom.code },
				withCredentials: true,
			});

			dispatch({ type: ActionType.UPDATE, payload: [updatedRoom] });

			if (connectionRef.current) {
				await connectionRef.current.invoke("playerRemove", id);
			} else {
				console.log("ERROR: NO CONNECTION REF");
			}
		} catch (error) {
			console.log(error);
			toast("Error removing player", "warn");
		}
	}

	async function handleUpdatePlayers() {}
	async function handleCloseRoom() {}
	async function handleGameStart() {}
	async function handleGameEnd() {}

	return (
		<DashboardLayout>
			<DashboardHeader title="Create Pod" user={user} align="left">
				<ButtonIcon
					styles={`size-[2em] active:text-white hover:text-white ${
						!hostedRoom && "hidden"
					}`}
					onClick={() => setIsDialogOpen(true)}
				>
					<Exit />
				</ButtonIcon>
			</DashboardHeader>
			<DashboardMain>
				<div className={`dashboard-main-content-layout gap-8 !max-w-lg`}>
					{rooms.length == 0 ? (
						<div>
							<ButtonPrimary onClick={handleCreateRoom}>
								Create new pod
							</ButtonPrimary>
						</div>
					) : hostedRoom ? (
						<>
							{/* Warning Modal for Leaving Room */}
							<Dialog
								title="Leave Pod"
								description="Leaving as host will close the pod"
								isDialogOpen={isDialogOpen}
								setIsDialogOpen={setIsDialogOpen}
								onConfirm={() => handleLeaveRoom()}
							/>

							{/* Room Code Display */}
							<div className="flex flex-col items-center mb-2">
								<span className="text-xl">Room Code:</span>
								<span className="text-xl uppercase font-bold tracking-wide text-white px-3 py-3 bg-primary-400 rounded-xl my-2">
									{hostedRoom.code.slice(0, 3) + " " + hostedRoom.code.slice(3)}
								</span>
							</div>

							{/* Player List */}
							<div className="flex flex-col self-start px-6 w-full">
								<h3 className="uppercase self-start mb-2">Players</h3>
								<div className="flex flex-col gap-2">
									{hostedRoom?.players?.length &&
										hostedRoom.players.map((player) => (
											<div
												className="flex justify-between items-center bg-white/5 border border-surface-500 py-2 px-4 w-full rounded-lg"
												key={player.id}
											>
												<UserCard user={player} />
												{player.id !== user?.id && (
													<ButtonIcon
														styles="size-[2em] active:text-white"
														onClick={() => handleRemovePlayer(player.id)}
													>
														<UserRemove />
													</ButtonIcon>
												)}
											</div>
										))}
								</div>
							</div>

							{/* Friend List */}
							<div className="flex flex-col self-start px-6 w-full">
								<h3 className="uppercase self-start mb-2">Add Friends</h3>
								<div className="flex flex-col items-center justify-between relative">
									<ComboBox
										list={friends.filter((f) => f.id !== user?.id)}
										query={query}
										setQuery={setQuery}
										selected={selected}
										setSelected={setSelected}
									/>

									<div className="self-end">
										<ButtonPrimary onClick={handleAddPlayer}>
											<span>Add</span>
											<div className="size-[1.8em]">
												<UserAdd />
											</div>
										</ButtonPrimary>
									</div>
								</div>
							</div>

							<div className="flex justify-center w-full border-t border-surface-500 -mb-8 lg:-mb-12 mt-8">
								<div className="mt-2 flex w-full justify-center items-center gap-4 px-8 max-w-sm">
									<ButtonPrimary onClick={() => {}} style="primary">
										Start Game
									</ButtonPrimary>
								</div>
							</div>
						</>
					) : (
						<div className="flex flex-col gap-2">
							<div className="text-base mt-4">
								Cannot create a pod while currently in one
							</div>

							<div className="w-fit self-center">
								<ButtonPrimary
									onClick={() => router.push("/pod/join")}
									uppercase={false}
								>
									Go to Joined Pod
								</ButtonPrimary>
							</div>
						</div>
					)}
				</div>
			</DashboardMain>
		</DashboardLayout>
	);
}
