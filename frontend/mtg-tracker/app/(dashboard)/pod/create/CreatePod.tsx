"use client";
import ButtonIcon from "@/components/ButtonIcon";
import ButtonPrimary from "@/components/ButtonPrimary";
import {
	DashboardLayout,
	DashboardHeader,
	DashboardMain,
} from "@/components/Dashboard";
import { ActionType } from "@/context/RoomContext";
import { api, schemas } from "@/generated/client";
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
import { getRooms } from "@/actions/rooms";
import { HubConnection, HubConnectionState } from "@microsoft/signalr";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import Lobby from "@/components/Lobby";
import InGameScreen from "@/components/InGameScreen";

export interface CurrentGameData {
	startTime: number;
	winner: UserReadDTO | null;
}

export interface UserDeckData {
	id: string;
	deckData: DeckReadDTO;
}

interface CreatePodInterface {}

export default function CreatePod({}: CreatePodInterface) {
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
  const playerIds = hostedRoom?.players?.map(p => p.id) ?? [];
	const canStartGame =
		!!hostedRoom &&
		!!hostedRoom.players &&
		hostedRoom.players.length > 1 &&
		!!playerIdToDeck  &&
    playerIds.every(id => Object.keys(playerIdToDeck).includes(id));

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
			setLocalStorageGameData(null);
			setCurrentGameData(null);
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

	// Attempt to get User Deck selection data from localstorage
	useEffect(() => {
		if (hostedRoom && hostedRoom.players) {
			for (const player of hostedRoom.players) {
				const playerDeckDataString = window.localStorage.getItem(player.id);

				if (playerDeckDataString != null) {
					try {
						const playerDeckDataParsed: unknown =
							JSON.parse(playerDeckDataString);
						if (
							playerDeckDataParsed &&
							typeof playerDeckDataParsed === "object" &&
							"deckData" in playerDeckDataParsed &&
							"id" in playerDeckDataParsed &&
							typeof playerDeckDataParsed["id"] === "string"
						) {
							const playerId = playerDeckDataParsed["id"];
							const playerDeckData = schemas.DeckReadDTO.parse(
								playerDeckDataParsed["deckData"]
							);
							setPlayerIdToDeck((prev) => ({
								...prev,
								[playerId]: playerDeckData,
							}));
						} else {
							throw Error("Invalid localStorage data");
						}
					} catch (error) {
						console.log("Zod Error parsing DeckReadDTO", error);
						setLocalStorageGameData(null);
						setCurrentGameData(null);
					}
				} else {
					// No valid deck for some player -> abort game
					setLocalStorageGameData(null);
					setCurrentGameData(null);
				}
			}

			if (localStorageGameData) {
				setCurrentGameData(localStorageGameData);
			}
		}
	}, []);

	return (
		<DashboardLayout>
			<DashboardHeader title="Create Pod" user={user} align="left">
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
