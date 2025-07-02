"use client";
import { FormEvent, useState } from "react";
import ButtonPrimary from "@/components/ButtonPrimary";
import {
	DeckReadDTO,
	GameParticipationReadDTO,
	GameParticipationWriteDTO,
	GameWriteDTO,
	UserReadDTO,
} from "@/types/client";
import UserCard from "@/components/UserCard";
import { useAuth } from "@/hooks/useAuth";
import ButtonIcon from "@/components/ButtonIcon";
import UserRemove from "@/public/icons/user-remove.svg";
import UserAdd from "@/public/icons/user-add.svg";
import ComboBox from "@/components/ComboBox";
import { useFriend } from "@/hooks/useFriend";
import {
	DashboardLayout,
	DashboardHeader,
	DashboardMain,
} from "@/components/Dashboard";
import useToast from "@/hooks/useToast";
import { useDeck } from "@/hooks/useDeck";
import { useGame } from "@/hooks/useGame";
import { useGameParticipation } from "@/hooks/useGameParticipation";
import { ActionType as GameActionType } from "@/context/GameContext";
import { ActionType as GameParticipationActionType } from "@/context/GameParticipationContext";
import { deleteGame, postGame } from "@/actions/games";
import { extractAuthResult } from "@/helpers/extractAuthResult";
import { postGameParticipation } from "@/actions/gameParticipations";

export default function Import() {
	const { toast } = useToast();
	const { user } = useAuth();
	const { decks } = useDeck();
	const { friends } = useFriend();
	const [selected, setSelected] = useState<string | null>(null);
	const [query, setQuery] = useState("");
	const [playerIdToDeck, setPlayerIdToDeck] = useState<
		Record<string, DeckReadDTO | null>
	>({});
	const [players, setPlayers] = useState<UserReadDTO[]>([]);
	const [winner, setWinner] = useState<UserReadDTO | null>(null);
	const [isFetching, setIsFetching] = useState(false);
	const { gameState, dispatch: dispatchGameState } = useGame();
	const { gameParticipations, dispatch: dispatchGameParticipation } =
		useGameParticipation();

	// Have to do this because by default the user loaded through useAuth hook does not include
	// deck data.
	if (user) {
		user.decks = decks;
	}

	function handleAddPlayer(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (user && selected === user.userName) {
			if (players.includes(user)) {
				return;
			}
			setPlayers((prev) => [...prev, user]);
			return;
		}

		if (!players.find((p) => p.userName === selected)) {
			const playerReadDTO = friends.find((f) => f.userName === selected);
			if (!playerReadDTO) {
				return;
			}
			setPlayers((prev) => [...prev, playerReadDTO]);
		}
	}

	function handleRemovePlayer(playerId: string) {
		setWinner(null);
		setPlayers(players.filter((p) => p.id !== playerId));
	}

	function handleSetWinner(e: React.MouseEvent, player: UserReadDTO) {
		e.stopPropagation();
		setWinner(player);
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
				numPlayers: players.length,
				numTurns: 0,
				seconds: 0,
				createdAt: new Date().toISOString(),
				createdByUserId: user.id,
				winnerId: winner.id,
				imported: true,
			};

      const authResult = await postGame(gameWriteDTO);
      const gameReadDTO = extractAuthResult(authResult);
      
      if (gameReadDTO == null) {
        throw Error("No Game Data");
      }

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
        const authResult = await postGameParticipation(gameParticipationWriteDTO);
        const gpReadDTO = extractAuthResult(authResult);
        
        if (gpReadDTO == null) {
          throw Error("No Game Participation info");
        }

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
			setIsFetching(false);
		} catch (error) {
			if (gameSaved) {
				// Revert, delete game data
        await deleteGame(gameSavedId);
			}
			console.log(error);
			toast("Error saving game", "warn");
			setIsFetching(false);
		}
	}

	let selectOptions = [...friends].map((f) => f.userName);
	if (user) {
		selectOptions.push(user.userName);
	}
	selectOptions = selectOptions.filter(
		(option) => !players.find((p) => p.userName === option)
	);

	return (
		<DashboardLayout>
			<DashboardHeader title="Import Games" user={user} />
			<DashboardMain>
				<section className="dashboard-main-content-layout gap-4 !max-w-lg">
					<h2 className="text-lg mt-2">Importing Games</h2>
					<section className="mx-6 flex flex-col gap-2">
						<p>
							You can import games that were not originally tracked using
							ScrollRack to add those games to your match history.
						</p>
						<p>
							{" "}
							Imported games will not count towards certain record statistics
							(e.g. fastest/slowest wins and longest win/loss streaks).
						</p>
					</section>
					<div className="flex flex-col w-full gap-3 mt-6">
						<div className="flex flex-col justify-between px-2 gap-4">
							{/* Player List */}
							<div className="flex flex-col self-start px-6 w-full">
								<h3 className="uppercase self-start mb-2">Players</h3>
								<div className="flex flex-col gap-2 w-full">
									{players.length === 0 && (
										<div className="w-full flex center my-4 justify-center">
											No players
										</div>
									)}
									{players.length > 0 &&
										players.map((player) => (
											<div
												className={`${
													player === winner && "!border-primary-200 !border-4"
												} flex justify-between items-center w-full rounded-lg relative overflow-hidden bg-white/5`}
												key={player.id}
											>
												<div
													className="w-full"
													onClick={(e) => handleSetWinner(e, player)}
												>
													<UserCard
														user={player}
														useDeckSelector={true}
														playerIdToDeck={playerIdToDeck}
														setPlayerIdToDeck={setPlayerIdToDeck}
													/>
												</div>
												<ButtonIcon
													styles="size-[1.8em] active:text-white hover:text-white absolute top-0 right-0 mt-4.5 mr-4"
													onClick={() => handleRemovePlayer(player.id)}
												>
													<UserRemove />
												</ButtonIcon>
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
										list={selectOptions}
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

							<section className="flex flex-col w-full px-6 mb-2 items-end -mt-4">
								<div className="flex w-full justify-center items-center">
									<div className="grow">
										<ButtonPrimary
											onClick={handleSaveGame}
											disabled={!winner || players.length <= 1 || isFetching}
											uppercase={false}
										>
											Save
										</ButtonPrimary>
									</div>
								</div>
							</section>
						</div>
					</div>
				</section>
			</DashboardMain>
		</DashboardLayout>
	);
}
