import {
	AddPlayerDTO,
	DeckReadDTO,
	RoomDTO,
	UserReadDTO,
} from "@/types/client";
import ButtonIcon from "./ButtonIcon";
import ButtonPrimary from "./ButtonPrimary";
import ComboBox from "./ComboBox";
import UserCard from "./UserCard";
import UserRemove from "@/public/icons/user-remove.svg";
import UserAdd from "@/public/icons/user-add.svg";
import { Dispatch, FormEvent, MutableRefObject, SetStateAction, useState } from "react";
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
  playerIdToDeck: Record<string, DeckReadDTO | null>
  setPlayerIdToDeck: Dispatch<SetStateAction<Record<string, DeckReadDTO | null>>>;
  canStartGame: boolean;
}

export default function Lobby({
	hostedRoom,
	user,
	friends,
	connectionRef,
	setCurrentGameData,
	setLocalStorageValue,
  playerIdToDeck,
  setPlayerIdToDeck,
  canStartGame,
}: LobbyInterface) {
	const [selected, setSelected] = useState<string | null>(null);
	const [query, setQuery] = useState("");
	const { rooms, dispatch } = useRoom();
	const { toast } = useToast();
  
  function sortRoomPlayers(roomDTO: RoomDTO) {
    if (!user || !roomDTO.players) {
      return;
    }

    roomDTO.players.sort((a, b) => {
      if (a.id === user.id) {
        return -1;
      } else if (b.id === user.id) {
        return 1;
      } else {
        return a.userName.localeCompare(b.userName);
      }
    })
  }

	async function handleAddPlayer(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

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
			setSelected(null);
			setQuery("");

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
    if (!canStartGame) {
      return;
    }

		const initialGameData: CurrentGameData = {
			startTime: Date.now(),
			winner: null,
		};
		setLocalStorageValue(initialGameData);
		setCurrentGameData(initialGameData);
	}
  
  console.log(JSON.stringify(hostedRoom.players?.map(p => p.userName)))

	return (
		<>
			{/* Room Code Display */}
			<div className="flex flex-col items-center">
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
								className="flex justify-between items-center w-full rounded-lg relative overflow-hidden bg-white/5"
								key={player.id}
							>
								<div className="w-full">
									<UserCard
										user={player}
										useDeckSelector={true}
										playerIdToDeck={playerIdToDeck}
										setPlayerIdToDeck={setPlayerIdToDeck}
									/>
									{player.id !== user?.id && (
										<ButtonIcon
											styles="size-[1.8em] active:text-white hover:text-white absolute top-0 right-0 mt-4.5 mr-4"
											onClick={() => handleRemovePlayer(player.id)}
										>
											<UserRemove />
										</ButtonIcon>
									)}
								</div>
							</div>
						))}
				</div>
			</div>

			{/* Friend List */}
			<div className="flex flex-col self-start px-6 w-full">
				<h3 className="uppercase self-start mb-2">Add Friends</h3>
				<form
					className="flex flex-col items-center justify-between relative"
					onSubmit={(e) => handleAddPlayer(e)}
				>
					<ComboBox
						list={friends
							.filter(
								(f) =>
									f.id !== user?.id &&
									!hostedRoom.players?.find((p) => p.id === f.id)
							)
							.map((f) => f.userName)}
						query={query}
						setQuery={setQuery}
						selected={selected}
						setSelected={setSelected}
					/>

					<div className="self-end">
						<ButtonPrimary
							type="submit"
							onClick={() => {}}
							style="transparent"
							uppercase={false}
						>
							<span>Add</span>
							<div className="size-[1.8em]">
								<UserAdd />
							</div>
						</ButtonPrimary>
					</div>
				</form>
			</div>

			<div className="flex justify-center w-full border-t border-surface-500 -mb-8 lg:-mb-12">
				<div className="mt-2 flex w-full justify-center items-center gap-4 px-16 max-w-sm">
					<ButtonPrimary
						onClick={handleStartGame}
						style="primary"
						uppercase={false}
            disabled={!canStartGame}
					>
						Start Game
					</ButtonPrimary>
				</div>
			</div>
		</>
	);
}
