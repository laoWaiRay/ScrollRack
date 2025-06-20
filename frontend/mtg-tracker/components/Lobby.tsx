import { AddPlayerDTO, RoomDTO, UserReadDTO } from "@/types/client";
import ButtonIcon from "./ButtonIcon";
import ButtonPrimary from "./ButtonPrimary";
import ComboBox from "./ComboBox";
import UserCard from "./UserCard";
import UserRemove from "@/public/icons/user-remove.svg";
import UserAdd from "@/public/icons/user-add.svg";
import { MutableRefObject, useState } from "react";
import { HubConnection } from "@microsoft/signalr";
import useToast from "@/hooks/useToast";
import { useRoom } from "@/hooks/useRoom";
import { api } from "@/generated/client";
import { ActionType } from "@/context/RoomContext";
import { CurrentGameData } from "@/app/(dashboard)/pod/create/CreatePod";
import { isAxiosError } from "axios";
import { CONFLICT } from "@/constants/httpStatus";

interface LobbyInterface {
	hostedRoom: RoomDTO;
	user: UserReadDTO | null;
  friends: UserReadDTO[];
  connectionRef: MutableRefObject<HubConnection | null>;
  setLocalStorageValue: (value: CurrentGameData | null) => void;
  setCurrentGameData: (value: CurrentGameData | null) => void;
}

export default function Lobby({
	hostedRoom,
	user,
  friends,
  connectionRef,
  setCurrentGameData,
  setLocalStorageValue,
}: LobbyInterface) {
	const [selected, setSelected] = useState<string | null>(null);
	const [query, setQuery] = useState("");
	const { rooms, dispatch } = useRoom();
  const { toast } = useToast();

	async function handleAddPlayer() {
		if (!hostedRoom) {
			toast("Error adding friend", "warn");
			return;
		}

		const friend = friends.find((f) => f.userName === selected);
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
      if (isAxiosError(error) && error.response?.status === CONFLICT) {
        toast("User is already in a pod", "warn");
      } else {
        toast("Error adding friend", "warn");
      }
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

	async function handleStartGame() {
    const initialGameData: CurrentGameData = {
      startTime: Date.now(),
      winner: null,
    };
		setLocalStorageValue(initialGameData);
    setCurrentGameData(initialGameData);
	}

	return (
		<>
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
										styles="size-[1.5em] active:text-white hover:text-white"
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
						list={friends.filter((f) => f.id !== user?.id).map((f) => f.userName)}
						query={query}
						setQuery={setQuery}
						selected={selected}
						setSelected={setSelected}
					/>

					<div className="self-end">
						<ButtonPrimary onClick={handleAddPlayer} style="transparent" uppercase={false}>
							<span>Add</span>
							<div className="size-[1.8em]">
								<UserAdd />
							</div>
						</ButtonPrimary>
					</div>
				</div>
			</div>

			<div className="flex justify-center w-full border-t border-surface-500 -mb-8 lg:-mb-12 mt-8">
				<div className="mt-2 flex w-full justify-center items-center gap-4 px-16 max-w-sm">
					<ButtonPrimary onClick={handleStartGame} style="primary" uppercase={false}>
						Start Game
					</ButtonPrimary>
				</div>
			</div>
		</>
	);
}
