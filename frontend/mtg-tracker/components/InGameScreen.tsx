"use client";
import { CurrentGameData } from "@/app/(dashboard)/pod/create/CreatePod";
import {
	DeckReadDTO,
	GameReadDTO,
	GameWriteDTO,
	GameParticipationWriteDTO,
	UserReadDTO,
} from "@/types/client";
import { useEffect, useState } from "react";
import ButtonPrimary from "./ButtonPrimary";
import UserCard from "./UserCard";
import Crown from "@/public/icons/crown.svg";
import { Button } from "@headlessui/react";
import { api } from "@/generated/client";
import useToast from "@/hooks/useToast";

interface InGameScreenInterface {
	startTime: number;
	user: UserReadDTO | null;
	players: UserReadDTO[];
	setLocalStorageValue: (value: CurrentGameData | null) => void;
	setCurrentGameData: (value: CurrentGameData | null) => void;
	playerIdToDeck: Record<string, DeckReadDTO | null>;
}

export default function InGameScreen({
	startTime,
	user,
	players,
	setLocalStorageValue,
	setCurrentGameData,
	playerIdToDeck,
}: InGameScreenInterface) {
	const [elapsedTimeInSeconds, setElapsedTimeInSeconds] = useState(() => {
		// startTime is an epoch timestamp
		const deltaInMs = Date.now() - startTime;
		return Math.floor(deltaInMs / 1000);
	});
	const [winner, setWinner] = useState<UserReadDTO | null>(null);
	const { toast } = useToast();

	async function handleAbortGame() {
		setLocalStorageValue(null);
		setCurrentGameData(null);
	}

	async function handleSaveGame() {
		if (!winner || !players.some((p) => p.id === winner.id)) {
			toast("Must select a winner", "warn");
			return;
		}

		let gameSaved = false;
    let gameSavedId = 0;

		try {
			const gameWriteDTO: GameWriteDTO = {
				numPlayers: players.length,
				numTurns: 0,
				seconds: elapsedTimeInSeconds,
				createdAt: (new Date(startTime)).toISOString(),
			};

			const gameReadDTO = await api.postApiGame(gameWriteDTO, {
				withCredentials: true,
			});

			gameSaved = true;
      gameSavedId = gameReadDTO.id;

			const gameParticipationWriteDTOs: GameParticipationWriteDTO[] = [];

			for (const [playerId, deckData] of Object.entries(playerIdToDeck)) {
				const isWinner = winner.id === playerId;

				if (deckData == null) {
					throw Error("Deck data for user is null");
				}

				const gameParticipationWriteDTO: GameParticipationWriteDTO = {
					userId: playerId,
					deckId: deckData.id,
					gameId: gameReadDTO.id,
					won: isWinner,
				};

				gameParticipationWriteDTOs.push(gameParticipationWriteDTO);
			}

			for (const gameParticipationWriteDTO of gameParticipationWriteDTOs) {
				await api.postApiGameParticipation(gameParticipationWriteDTO, {
					withCredentials: true,
				});
			}

			toast("Game saved", "success");
      setLocalStorageValue(null);
      setCurrentGameData(null);
		} catch (error) {
			if (gameSaved) {
				// Revert, delete game data
        await api.deleteApiGameId(undefined, { params: { id: gameSavedId }, withCredentials: true });
			}
      console.log(error)
      toast("Error saving game", "warn");
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

	function formatTime(seconds: number) {
		const hours = Math.floor(seconds / 3600)
			.toString()
			.padStart(2, "0");
		const minutes = Math.floor((seconds % 3600) / 60)
			.toString()
			.padStart(2, "0");
		const secs = Math.floor(seconds % 60)
			.toString()
			.padStart(2, "0");
		return `${hours}:${minutes}:${secs}`;
	}

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
							disabled={!winner}
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
