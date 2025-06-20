import { getImageUrl } from "@/helpers/scryfallApi";
import { DeckReadDTO } from "@/types/client";
import Image from "next/image";
import Moxfield from "@/public/icons/moxfield.svg";
import ButtonPrimary from "./ButtonPrimary";

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
			<div className="w-full flex justify-center items-center px-4 mb-2 gap-3 lg:justify-center">
				<h2 className="font-semibold">{deck.commander}</h2>
				{deck.moxfield && (
					<a
						href={deck.moxfield}
						className="-mr-1 border rounded-lg border-surface-500 p-1"
					>
						<div className="size-[2em] flex items-center justify-center">
							<Moxfield />
						</div>
					</a>
				)}
			</div>

			<div className="flex flex-col w-full lg:flex-row lg:justify-center lg:gap-2">
				<section className="grow w-full lg:w-fit mb-2 flex justify-center self-center max-w-[336px]">
					<div className="aspect-[5/7] relative rounded-3xl overflow-hidden max-w-[336px] w-full">
						<Image
							src={getImageUrl(deck.scryfallId)}
							fill={true}
							alt="card art"
						/>
					</div>
				</section>

				<section className="flex flex-col grow min-w-1/2 justify-between lg:justify-start gap-1 px-4 lg:min-w-0 lg:max-w-xs lg:mt-5">
					{renderStats()}
				</section>
			</div>
		</div>
	);
}
