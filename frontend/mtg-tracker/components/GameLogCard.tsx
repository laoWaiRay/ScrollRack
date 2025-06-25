import { formatTime, IsoToDateString } from "@/helpers/time";
import Close from "@/public/icons/close.svg";
import ButtonIcon from "./ButtonIcon";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import Dialog from "./Dialog";
import { api } from "@/generated/client";
import { useGameParticipation } from "@/hooks/useGameParticipation";
import { useGame } from "@/hooks/useGame";
import useToast from "@/hooks/useToast";
import { ActionType as GameActionType } from "@/context/GameContext";
import { ActionType as GameParticipationActionType } from "@/context/GameParticipationContext";
import { GameParticipationReadDTO, GameReadDTO } from "@/types/client";

interface GameLogCellInterface {
	header: string;
	data: string;
	width?: string;
	styles?: string;
}

interface GameLogCardInterface {
	game: GameReadDTO;
	showButtons?: boolean;
}

function GameLogCell({ header, data, width, styles }: GameLogCellInterface) {
	return (
		<div className={`flex flex-col shrink ${width} ${styles}`}>
			<h4 className="text-fg-dark text-sm">{header}</h4>
			<div>{data}</div>
		</div>
	);
}

export function GameLogCard({
	game,
	showButtons = false,
}: GameLogCardInterface) {
	const { user } = useAuth();
	const { gameState, dispatch: dispatchGame } = useGame();
	const { gameParticipations, dispatch: dispatchGameParticipation } =
		useGameParticipation();
	const { toast } = useToast();
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const thisGameParticipation: GameParticipationReadDTO | undefined =
		game.gameParticipations?.find((gp) => gp.userId === user?.id);

	const thisGameWinner = game.gameParticipations?.find(
		(gp) => gp.userId === game.winnerId
	)?.user;

	async function handleDeleteGame() {
		if (!thisGameParticipation) {
			console.log("Error in handleDeleteGame: no gameParticipation found");
			return;
		}

		try {
			await api.deleteApiGameId(undefined, {
				params: { id: game.id },
				withCredentials: true,
			});
			dispatchGame({
				type: GameActionType.UPDATE,
				payload: [...gameState.games.filter((g) => g.id !== game.id)],
			});
			dispatchGameParticipation({
				type: GameParticipationActionType.UPDATE,
				payload: [
					...gameParticipations.filter(
						(gp) => gp.id !== thisGameParticipation.id
					),
				],
			});

			toast("Deleted game", "success");
		} catch (error) {
			console.log(error);
			toast("Error deleting game", "warn");
		}
	}

	return (
		<div className="flex flex-col bg-card-surface rounded-lg px-4 py-2 lg:p-8">
			{showButtons && (
				<Dialog
					title={`Deleting Game`}
					description={`This action cannot be undone. Are you sure you want to delete your game from ${new Date(
						game.createdAt
					).toLocaleString()}?`}
					isDialogOpen={isDialogOpen}
					setIsDialogOpen={setIsDialogOpen}
					onConfirm={() => handleDeleteGame()}
					useCountdown={true}
				/>
			)}

			<div className="flex flex-col w-full rounded-lg gap-3 lg:flex-row justify-between lg:items-start relative">
				<GameLogCell
					header="DATE"
					data={IsoToDateString(game.createdAt)}
					width="w-[5.5rem]"
				/>
				<GameLogCell
					header="COMMANDER"
					data={thisGameParticipation?.deck.commander.toString() ?? ""}
					width="lg:w-[8rem]"
				/>
				<GameLogCell header="PLAYERS" data={game.numPlayers.toString()} />
				<div className="lg:hidden flex flex-col gap-2">
					<h2 className="text-sm text-fg-dark">POD</h2>
					<div className="flex flex-wrap gap-2">
						{game.gameParticipations?.map((gp) => {
							return (
								<div
									key={gp.id}
									className="border border-surface-500 w-fit px-3 py-1.5 rounded-lg flex flex-col min-w-48"
								>
									<div>{gp.user.userName}</div>
									<div className="text-sm uppercase text-fg-dark">
										{gp.deck.commander}
									</div>
								</div>
							);
						})}
					</div>
				</div>
				<GameLogCell
					header="WINNER"
					data={thisGameWinner?.userName ?? ""}
					width="w-[6rem]"
				/>
				<GameLogCell
					header="TIME"
					data={formatTime(game.seconds, "hms")}
					width="w-[4rem]"
					styles={showButtons ? "" : "lg:hidden"}
				/>
				{showButtons && user && game.createdByUserId === user.id && (
					<div className="absolute right-0 lg:static">
						<div className="flex gap-2">
							<ButtonIcon
								styles="border border-surface-400 h-fit p-2"
								onClick={() => setIsDialogOpen && setIsDialogOpen(true)}
							>
								<div className="size-[1.2em]">
									<Close />
								</div>
							</ButtonIcon>
						</div>
					</div>
				)}
			</div>
			<div className={`gap-2 mt-4 hidden ${showButtons && "lg:flex"} flex-col`}>
				<h2 className="text-sm text-fg-dark">POD</h2>

				<div className="flex gap-2 mx-1">
					{game.gameParticipations?.map((gp) => {
						return (
							<div
								key={gp.id}
								className="border border-surface-500 w-fit px-3 py-1.5 rounded-lg flex-col flex flex-wrap"
							>
								<div>{gp.user.userName}</div>
								<div className="text-sm uppercase text-fg-dark">
									{gp.deck.commander}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
