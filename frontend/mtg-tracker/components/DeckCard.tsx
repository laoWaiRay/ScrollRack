import { getImageUrl } from "@/helpers/scryfallApi";
import { DeckReadDTO } from "@/types/client";
import Image from "next/image";

interface DeckCardInterface {
	deck: DeckReadDTO;
}

interface DeckStat {
	title: string;
	data: string;
}

export default function DeckCard({ deck }: DeckCardInterface) {
	const deckStats: DeckStat[] = [
		{
			title: "Games",
			data: deck.numGames.toString(),
		},
		{
			title: "Wins",
			data: deck.numWins.toString(),
		},
		{
			title: "Last Win",
			data: "Feb 12, 2025",
		},
		{
			title: "Streak (Win/Loss)",
			data: "4/7",
		},
		{
			title: "Longest Win Streak",
			data: "3",
		},
		{
			title: "Longest Loss Streak",
			data: "10",
		},
		{
			title: "Fastest Win",
			data: "00:10:42",
		},
		{
			title: "Longest Game",
			data: "05:32:45",
		},
	];

	function renderStats() {
		return deckStats.map((stat) => (
			<div key={stat.title} className="flex justify-between">
				<span>{`${stat.title}:`}</span>
				<span>{stat.data}</span>
			</div>
		));
	}
	return (
		<div className="flex flex-col w-full p-4 bg-surface-500/30 rounded-lg">
			<h2 className="font-semibold mb-2 self-center">{deck.commander}</h2>

			<div className="flex flex-col w-full">
				<section className="grow w-full mb-2 flex justify-center">
					<div className="aspect-[5/7] relative rounded-3xl overflow-hidden max-w-[336px] w-full">
						<Image
							src={getImageUrl(deck.scryfallId)}
							fill={true}
							alt="card art"
						/>
					</div>
				</section>

				<section className="flex flex-col grow min-w-1/2 justify-between gap-1 px-4">
					{renderStats()}
				</section>
			</div>
		</div>
	);
}
