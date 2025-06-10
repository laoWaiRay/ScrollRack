interface GameLogCellInterface {
	header: string;
	data: string;
}

export interface GameData {
	date: string;
	commander: string;
	players: string;
	winner: string;
}

interface GameLogCardInterface {
	gameData: GameData;
}

function GameLogCell({ header, data }: GameLogCellInterface) {
	return (
		<div className="flex flex-col">
			<h4 className="text-fg text-sm mb-[2px]">{header}</h4>
			<div>{data}</div>
		</div>
	);
}

export function GameLogCard({ gameData }: GameLogCardInterface) {
	return (
		<div className="flex gap-4 w-full justify-between py-2 first-of-type:pt-0">
			<GameLogCell header="DATE" data={gameData.date} />
			<GameLogCell header="COMMANDER" data={gameData.commander} />
			<GameLogCell header="PLAYERS" data={gameData.players} />
			<GameLogCell header="WINNER" data={gameData.winner} />
		</div>
	);
}
