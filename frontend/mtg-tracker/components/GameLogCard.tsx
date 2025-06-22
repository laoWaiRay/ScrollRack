import { GameData } from "@/app/(dashboard)/log/Log";
import { formatTime, IsoToDateString } from "@/helpers/time";
import Edit from "@/public/icons/edit.svg";
import Close from "@/public/icons/close.svg";
import ButtonIcon from "./ButtonIcon";
import { useAuth } from "@/hooks/useAuth";
import { Dispatch, SetStateAction, useState } from "react";
import Dialog from "./Dialog";
import { api } from "@/generated/client";
import { useGameParticipation } from "@/hooks/useGameParticipation";
import { useGame } from "@/hooks/useGame";
import useToast from "@/hooks/useToast";
import { ActionType as GameActionType } from "@/context/GameContext";
import { ActionType as GameParticipationActionType } from "@/context/GameParticipationContext";

interface GameLogCellInterface {
	header: string;
	data: string;
	width?: string;
}

interface GameLogCardInterface {
	gameData: GameData;
}

function GameLogCell({ header, data, width }: GameLogCellInterface) {
	return (
		<div className={`flex flex-col ${width}`}>
			<h4 className="text-fg-dark">{header}</h4>
			<div suppressHydrationWarning>{data}</div>
		</div>
	);
}

export function GameLogCard({ gameData }: GameLogCardInterface) {
	const { user } = useAuth();
	const { games, dispatch: dispatchGame } = useGame();
	const { gameParticipations, dispatch: dispatchGameParticipation } =
		useGameParticipation();
	const { toast } = useToast();
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	async function handleDeleteGame() {
		console.log(`Delete game: ${gameData.gameId}`);
		try {
			await api.deleteApiGameId(undefined, {
				params: { id: gameData.gameId },
				withCredentials: true,
			});
			dispatchGame({
				type: GameActionType.UPDATE,
				payload: [...games.filter((g) => g.id !== gameData.gameId)],
			});
			dispatchGameParticipation({
				type: GameActionType.UPDATE,
				payload: [
					...gameParticipations.filter(
						(gp) => gp.id !== gameData.gameParticipationId
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
		<>
			<Dialog
				title={`Deleting Game`}
				description={`This action cannot be undone. Are you sure you want to delete your game from ${new Date(
					gameData.createdAt
				).toLocaleString()}?`}
				isDialogOpen={isDialogOpen}
				setIsDialogOpen={setIsDialogOpen}
				onConfirm={() => handleDeleteGame()}
				useCountdown={true}
			/>

			<div className="flex flex-col w-full py-4 px-4 bg-surface-500/30 rounded-lg gap-3 lg:flex-row lg:p-6 justify-between lg:items-center relative">
				<GameLogCell
					header="DATE"
					data={IsoToDateString(gameData.createdAt)}
					width="w-[6rem]"
				/>
				<GameLogCell
					header="COMMANDER"
					data={gameData.deck.commander.toString()}
					width="w-[12rem]"
				/>
				<GameLogCell header="PLAYERS" data={gameData.numPlayers.toString()} />
				<GameLogCell
					header="WINNER"
					data={gameData.winner?.userName ?? ""}
					width="w-[6rem]"
				/>
				<GameLogCell
					header="TIME"
					data={formatTime(gameData.seconds, "hms")}
					width="w-[4rem]"
				/>
				{user && gameData.createdByUserId === user.id && (
					<div className="absolute right-0 mr-4 lg:static lg:mr-0">
						<div className="flex gap-2">
							{/* <ButtonIcon styles="border border-surface-400 h-fit p-2">
							<div className="size-[1.2em]">
								<Edit />
							</div>
						</ButtonIcon> */}
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
		</>
	);
}
