"use client";
import ButtonIcon from "@/components/ButtonIcon";
import ButtonPrimary from "@/components/ButtonPrimary";
import {
	DashboardLayout,
	DashboardHeader,
	DashboardMain,
} from "@/components/Dashboard";
import { ActionType } from "@/context/RoomContext";
import { useAuth } from "@/hooks/useAuth";
import { useFriend } from "@/hooks/useFriend";
import { useRoom } from "@/hooks/useRoom";
import useToast from "@/hooks/useToast";
import Exit from "@/public/icons/exit.svg";
import { DeckReadDTO, RoomDTO, UserReadDTO } from "@/types/client";
import { useEffect, useState } from "react";
import Dialog from "@/components/Dialog";
import { useRouter } from "next/navigation";
import { useRoomConnection } from "@/hooks/useRoomConnection";
import { deleteRoom, getRooms, postRoom } from "@/actions/rooms";
import { HubConnection, HubConnectionState } from "@microsoft/signalr";
import {
	tryGetLocalStoragePlayerData,
	useLocalStorage,
} from "@/hooks/useLocalStorage";
import Lobby from "@/components/Lobby";
import InGameScreen from "@/components/InGameScreen";
import { extractAuthResult } from "@/helpers/extractAuthResult";

export interface CurrentGameData {
	startTime: number;
	winner: UserReadDTO | null;
}

export interface UserDeckData {
	id: string;
	deckData: DeckReadDTO;
}

export default function CreatePod() {
	const { toast } = useToast();
	const { user } = useAuth();
	const { friends } = useFriend();
	const { rooms, dispatch } = useRoom();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const router = useRouter();
	const [localStorageGameData, setLocalStorageGameData] =
		useLocalStorage<CurrentGameData>("game_in_progress_data");
	const [currentGameData, setCurrentGameData] =
		useState<CurrentGameData | null>(null);
	const [playerIdToDeck, setPlayerIdToDeck] = useState<
		Record<string, DeckReadDTO | null>
	>({});

	const hostedRoom = rooms.find((r) => r.roomOwnerId === user?.id);
	const playerIds = hostedRoom?.players?.map((p) => p.id) ?? [];
	const canStartGame =
		!!hostedRoom &&
		!!hostedRoom.players &&
		hostedRoom.players.length > 1 &&
		!!playerIdToDeck &&
		playerIds.every((id) => Object.keys(playerIdToDeck).includes(id));

	const handleReceiveUpdateRoom = (room: RoomDTO) => {
		dispatch({ type: ActionType.UPDATE, payload: [room] });
	};

	const handleReceivePlayerJoin = async (conn: HubConnection | null) => {
    const authResult = await getRooms();
    const rooms = extractAuthResult(authResult) ?? [];

		const updatedRoom = rooms.find(
			(r) => r.code === hostedRoom?.code
		);
		if (updatedRoom && conn?.state === HubConnectionState.Connected) {
			await conn?.invoke("updateRoom", updatedRoom.code, updatedRoom);
		}
	};

	const handleReceivePlayerLeave = async (conn: HubConnection | null) => {
    const authResult = await getRooms();
    const rooms = extractAuthResult(authResult) ?? [];

		const updatedRoom = rooms.find(
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
      const authResult = await postRoom();
      extractAuthResult(authResult);

      const getAuthResult = await getRooms();
      const rooms = extractAuthResult(getAuthResult) ?? [];
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
      const authResult = await deleteRoom();
      extractAuthResult(authResult);
			setLocalStorageGameData(null);
			setCurrentGameData(null);
			if (connectionRef.current) {
				connectionRef.current.invoke("closeRoom", hostedRoom.code);
			} else {
				console.log("ERROR: NO CONNECTION REF");
			}
			dispatch({ type: ActionType.UPDATE, payload: [] });
		} catch (error) {
      console.log(error);
			toast("Error closing pod", "warn");
		}
	}

	// Attempt to get User Deck selection data from localstorage
	useEffect(() => {
		if (hostedRoom && hostedRoom.players) {
			for (const player of hostedRoom.players) {
				const localStorageData = tryGetLocalStoragePlayerData(player.id);
				let playerId: string | null = null;
				let playerDeckData: DeckReadDTO | null = null;
				if (localStorageData != null) {
					({ playerId, playerDeckData } = localStorageData);
				}

				if (playerId != null && playerDeckData != null) {
					setPlayerIdToDeck((prev) => ({
						...prev,
						[playerId as string]: playerDeckData,
					}));
				} else {
					console.log("No valid player data found in local storage");
					setLocalStorageGameData(null);
					setCurrentGameData(null);
				}
			}

			if (localStorageGameData) {
				setCurrentGameData(localStorageGameData);
			}
		}
  // eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<DashboardLayout>
			<DashboardHeader title="Create Pod" user={user}>
				<ButtonIcon
					styles={`size-[2em] active:text-white hover:text-white translate-y-0.5 ${
						!hostedRoom && "hidden"
					}`}
					onClick={() => setIsDialogOpen(true)}
				>
					<Exit />
				</ButtonIcon>
			</DashboardHeader>
			<DashboardMain>
				<div className={`dashboard-main-content-layout gap-4 !max-w-lg`}>
					{rooms.length == 0 ? (
						<div>
							<ButtonPrimary onClick={handleCreateRoom} uppercase={false}>
								Create pod
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

							{!currentGameData ? (
								<Lobby
									friends={friends}
									user={user}
									hostedRoom={hostedRoom}
									connectionRef={connectionRef}
									setCurrentGameData={setCurrentGameData}
									setLocalStorageValue={setLocalStorageGameData}
									playerIdToDeck={playerIdToDeck}
									setPlayerIdToDeck={setPlayerIdToDeck}
									canStartGame={canStartGame}
								/>
							) : (
								<InGameScreen
									startTime={currentGameData.startTime}
									user={user}
									players={hostedRoom.players ?? []}
									setCurrentGameData={setCurrentGameData}
									setLocalStorageValue={setLocalStorageGameData}
									playerIdToDeck={playerIdToDeck}
									roomId={hostedRoom.id}
								/>
							)}
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
									style="transparent"
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
