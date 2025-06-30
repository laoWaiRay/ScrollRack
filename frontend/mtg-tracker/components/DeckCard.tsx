import { getImageUrl } from "@/helpers/scryfallApi";
import { DeckReadDTO, DeckStats } from "@/types/client";
import Image from "next/image";
import Moxfield from "@/public/icons/moxfield.svg";
import dayjs from "dayjs";
import { formatTime } from "@/helpers/time";
import { toPercent } from "@/helpers/math";

interface DeckCardInterface {
	deck: DeckReadDTO;
	deckStats: DeckStats;
	styles?: string;
}

interface DeckCardStat {
	title: string;
	data: string;
}

export default function DeckCard({
	deck,
	deckStats,
	styles,
}: DeckCardInterface) {
	const {
		numGames,
		numWins,
		par,
		longestWinStreak,
		longestLossStreak,
		latestWin,
		fastestWinInSeconds,
		slowestWinInSeconds,
		isCurrentWinStreak,
		currentStreak,
    lastPlayed,
	} = deckStats;

	const deckCardStats: DeckCardStat[] = [
		{
			title: "Games",
			data: numGames.toString(),
		},
		{
			title: "Wins",
			data: numWins.toString(),
		},
		{
			title: "Losses",
			data: (numGames - numWins).toString(),
		},
		{
			title: "Win Rate",
			data: numGames > 0 ? toPercent(numWins / numGames) : "-",
		},
		{
			title: "Par",
			data: par ? toPercent(par) : "-",
		},
		{
			title: "Current Streak",
			data: getStreakString(),
		},
		{
			title: "Longest Win Streak",
			data: longestWinStreak ? longestWinStreak.toString() : "-",
		},
		{
			title: "Longest Loss Streak",
			data: longestLossStreak ? longestLossStreak.toString() : "-",
		},
		{
			title: "Fastest Win",
			data: fastestWinInSeconds ? formatTime(fastestWinInSeconds, "hms") : "-",
		},
		{
			title: "Slowest Win",
			data: slowestWinInSeconds ? formatTime(slowestWinInSeconds, "hms") : "-",
		},
		{
			title: "Last Win",
			data: latestWin ? dayjs(latestWin).format("YYYY-MM-DD") : "-",
		},
		{
			title: "Last Played",
			data: lastPlayed ? dayjs(lastPlayed).format("YYYY-MM-DD") : "-",
		},
		// {
		// 	title: "Created",
		// 	data: dayjs(deck.createdAt).format("YYYY-MM-DD"),
		// },
	];

	let streakStyle = "";

	if (isCurrentWinStreak == true) {
		streakStyle = "text-success";
	}

	if (isCurrentWinStreak == false) {
		streakStyle = "text-error";
	}

	function getStreakString() {
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
		return deckCardStats.map((stat) => (
			<div key={stat.title} className="flex justify-between">
				<span>{`${stat.title}:`}</span>
				<span className={`${stat.title === "Current Streak" && streakStyle}`}>
					{stat.data}
				</span>
			</div>
		));
	}

	return (
		<div
			className={`flex flex-col w-full py-4 px-2 bg-card-surface rounded-lg ${styles}`}
		>
			<div className="w-full flex justify-center items-center px-4 mb-4">
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
				<section className="grow w-full lg:w-fit flex justify-center self-center max-w-[336px] lg:min-w-1/2">
					<div className="aspect-[5/7] relative rounded-3xl overflow-hidden max-w-[336px] w-full">
						<Image
							src={getImageUrl(deck.scryfallId)}
							fill={true}
							alt="card art"
						/>
					</div>
				</section>

				<section className="flex flex-col grow min-w-1/2 justify-between lg:justify-start gap-1 px-4 lg:max-w-xs lg:min-w-0 self-center lg:self-start w-full max-w-sm">
					{renderStats()}
				</section>
			</div>
		</div>
	);
}
