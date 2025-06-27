import { getImageUrl } from "@/helpers/scryfallApi";
import { DeckReadDTO } from "@/types/client";
import Image from "next/image";
import Moxfield from "@/public/icons/moxfield.svg";
import dayjs from "dayjs";
import { formatTime } from "@/helpers/time";
import { toPercent } from "@/helpers/math";

interface DeckCardInterface {
	deck: DeckReadDTO;
  styles?: string;
}

interface DeckStat {
	title: string;
	data: string;
}

export default function DeckCard({ deck, styles }: DeckCardInterface) {
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
			title: "Losses",
			data: (deck.numGames - deck.numWins).toString(),
		},
		{
			title: "Win Rate",
			data: deck.numGames > 0 ? toPercent(deck.numWins / deck.numGames) : "-",
		},
		{
			title: "Par",
			data: deck.par ? toPercent(deck.par) : "-",
		},
		{
			title: "Current Streak",
			data: getStreakString(),
		},
		{
			title: "Longest Win Streak",
			data: deck.longestWinStreak ? deck.longestWinStreak.toString() : "-",
		},
		{
			title: "Longest Loss Streak",
			data: deck.longestLossStreak ? deck.longestLossStreak.toString() : "-",
		},
		{
			title: "Last Win",
			data: deck.latestWin ? dayjs(deck.latestWin).format("YYYY-MM-DD") : "-",
		},
		{
			title: "Fastest Win",
			data: deck.fastestWinInSeconds ? formatTime(deck.fastestWinInSeconds, "hms") : "-",
		},
		{
			title: "Slowest Win",
			data: deck.slowestWinInSeconds ? formatTime(deck.slowestWinInSeconds, "hms") : "-",
		},
	];

	let streakStyle = "";

	if (deck.isCurrentWinStreak == true) {
		streakStyle = "text-success";
	}

	if (deck.isCurrentWinStreak == false) {
		streakStyle = "text-error";
	}

	function getStreakString() {
		const { currentStreak, isCurrentWinStreak } = deck;

		if (currentStreak == null || isCurrentWinStreak == null) {
			return "-";
		}

		const suffix =
			currentStreak === 1
				? isCurrentWinStreak
					? "Win"
					: "Loss"
				: isCurrentWinStreak
				? "Wins"
				: "Losses";

		return `${currentStreak} ${suffix}`;
	}

	function renderStats() {
		return deckStats.map((stat) => (
			<div key={stat.title} className="flex justify-between">
				<span>{`${stat.title}:`}</span>
				<span className={`${stat.title === "Current Streak" && streakStyle}`}>
					{stat.data}
				</span>
			</div>
		));
	}

	return (
		<div className={`flex flex-col w-full py-4 px-2 bg-card-surface rounded-lg ${styles}`}>
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
