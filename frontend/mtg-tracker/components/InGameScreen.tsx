"use client";
import { CurrentGameData } from "@/app/(dashboard)/pod/create/CreatePod";
import {
	DeckReadDTO,
	GameReadDTO,
	GameWriteDTO,
	GameParticipationWriteDTO,
	UserReadDTO,
	GameParticipationReadDTO,
} from "@/types/client";
import { useEffect, useState } from "react";
import ButtonPrimary from "./ButtonPrimary";
import UserCard from "./UserCard";
import Crown from "@/public/icons/crown.svg";
import { Button } from "@headlessui/react";
import { api } from "@/generated/client";
import useToast from "@/hooks/useToast";
import { useGameParticipation } from "@/hooks/useGameParticipation";
import { useGame } from "@/hooks/useGame";
import { ActionType as GameActionType } from "@/context/GameContext";
import { ActionType as GameParticipationActionType } from "@/context/GameParticipationContext";
import { formatTime } from "@/helpers/time";

interface InGameScreenInterface {
	startTime: number;
	user: UserReadDTO | null;
	players: UserReadDTO[];
	setLocalStorageValue: (value: CurrentGameData | null) => void;
	setCurrentGameData: (value: CurrentGameData | null) => void;
	playerIdToDeck: Record<string, DeckReadDTO | null>;
  roomId: number;
}

export default function InGameScreen({
	startTime,
	user,
	players,
	setLocalStorageValue,
	setCurrentGameData,
	playerIdToDeck,
  roomId,
}: InGameScreenInterface) {
	const [elapsedTimeInSeconds, setElapsedTimeInSeconds] = useState(() => {
		// startTime is an epoch timestamp
		const deltaInMs = Date.now() - startTime;
		return Math.floor(deltaInMs / 1000);
	});
	const [winner, setWinner] = useState<UserReadDTO | null>(null);
	const { toast } = useToast();
	const { gameState, dispatch: dispatchGameState } = useGame();
	const { gameParticipations, dispatch: dispatchGameParticipation } =
		useGameParticipation();
  const [isFetching, setIsFetching] = useState(false);
  
	async function handleAbortGame() {
		setLocalStorageValue(null);
		setCurrentGameData(null);
	}

	async function handleSaveGame() {
		if (!user) {
			console.log("Cannot save game - host user data missing");
			return;
		}

		if (!winner || !players.some((p) => p.id === winner.id)) {
			toast("Must select a winner", "warn");
			return;
		}

		let gameSaved = false;
		let gameSavedId = 0;

		try {
      setIsFetching(true);

			const gameWriteDTO: GameWriteDTO = {
        roomId,
				numPlayers: players.length,
				numTurns: 0,
				seconds: elapsedTimeInSeconds,
				createdAt: new Date(startTime).toISOString(),
				createdByUserId: user.id,
        winnerId: winner.id,
			};

			const gameReadDTO = await api.postApiGame(gameWriteDTO, {
				withCredentials: true,
			});

			gameSaved = true;
			gameSavedId = gameReadDTO.id;

			const gameParticipationWriteDTOs: GameParticipationWriteDTO[] = [];

			for (const player of players) {
        if (!(player.id in playerIdToDeck)) {
          throw Error("Player deck data not found");
        }

        const deckData = playerIdToDeck[player.id];
				const isWinner = winner.id === player.id;

				if (deckData == null) {
					throw Error("Deck data for user is null");
				}

				const gameParticipationWriteDTO: GameParticipationWriteDTO = {
					userId: player.id,
					deckId: deckData.id,
					gameId: gameReadDTO.id,
					won: isWinner,
				};

				gameParticipationWriteDTOs.push(gameParticipationWriteDTO);
			}

			let hostGpReadDTO: GameParticipationReadDTO | null = null;
			for (const gameParticipationWriteDTO of gameParticipationWriteDTOs) {
				const gpReadDTO = await api.postApiGameParticipation(
					gameParticipationWriteDTO,
					{
						withCredentials: true,
					}
				);
				if (gpReadDTO.userId === user.id) {
					hostGpReadDTO = gpReadDTO;
				}
			}

			toast("Game saved", "success");
			dispatchGameState({
				type: GameActionType.UPDATE,
				payload: [...gameState.games, gameReadDTO],
			});
			if (hostGpReadDTO) {
				dispatchGameParticipation({
					type: GameParticipationActionType.UPDATE,
					payload: [...gameParticipations, hostGpReadDTO],
				});
			}
			setLocalStorageValue(null);
			setCurrentGameData(null);
      setIsFetching(false);
		} catch (error) {
			if (gameSaved) {
				// Revert, delete game data
				await api.deleteApiGameId(undefined, {
					params: { id: gameSavedId },
					withCredentials: true,
				});
			}
			console.log(error);
			toast("Error saving game", "warn");
      setIsFetching(false);
		}
	}

	useEffect(() => {
		const handle = setInterval(() => {
			const now = Date.now();
			const deltaInMs = now - startTime;
			setElapsedTimeInSeconds(Math.floor(deltaInMs / 1000));
		}, 1000);

		return () => {
			clearInterval(handle);
		};
	}, []);

	return (
		<div className="w-full max-w-lg flex flex-col">
			<div className="text-2xl font-mono self-center my-6">
				{formatTime(elapsedTimeInSeconds)}
			</div>

			{/* Player List */}
			<div className="flex flex-col self-start px-6 w-full">
				<div className="flex flex-col gap-4">
					{players.map((player) => (
						<Button
							className={`${
								player === winner && "!border-primary-200 !border-4"
							} flex justify-between items-center w-full rounded-lg relative overflow-hidden bg-white/5`}
							key={player.id}
							onClick={() => setWinner(player)}
						>
							<UserCard
								user={player}
								textColor={
									player === winner ? "text-primary-100 font-semibold" : ""
								}
								useCommanderDisplay
							/>
							{player === winner && (
								<div className="w-full absolute flex justify-center top-0 mt-4">
									<div className={`size-[1.5em] ${"text-primary-200"}`}>
										<Crown />
									</div>
								</div>
							)}
						</Button>
					))}
				</div>
			</div>

			<section className="flex w-full justify-end">
				<div className="flex w-full justify-center items-center gap-4 px-8 max-w-sm mt-6">
					<div className="grow-1">
						<ButtonPrimary
							onClick={handleAbortGame}
							style="transparent"
							uppercase={false}
						>
							Cancel
						</ButtonPrimary>
					</div>
					<div className="grow-4">
						<ButtonPrimary
							onClick={handleSaveGame}
							disabled={!winner || isFetching}
							uppercase={false}
						>
							Save
						</ButtonPrimary>
					</div>
				</div>
			</section>
		</div>
	);
}
