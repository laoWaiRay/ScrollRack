"use client";
import styles from "./styles.module.css";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { StatSnapshotDTO } from "@/types/client";
import StatCard from "@/components/StatCard";
import { GameLogCard } from "@/components/GameLogCard";
import ButtonPrimary from "@/components/ButtonPrimary";
import PieChart from "@/components/PieChart";
import LineChart from "@/components/LineChart";
import {
	DashboardLayout,
	DashboardHeader,
	DashboardMain,
} from "@/components/Dashboard";
import { useGame } from "@/hooks/useGame";
import { useRouter } from "next/navigation";
import { useStatSnapshot } from "@/hooks/useStatSnapshot";

interface CommandZoneInterface {
	statSnapshot: StatSnapshotDTO | null;
}

interface StatCardData {
	title: string;
	data: string | number;
	subData: (string | number)[];
	styles?: { main: string; sub: string };
}

const statCardNumberStyles = {
	main: "text-2xl text-fg-light my-2 flex",
	sub: "text-fg-dark",
};

const statCardTextStyles = {
	main: "text-lg text-fg-light my-2",
	sub: "text-fg-dark",
};

export default function CommandZone({ statSnapshot }: CommandZoneInterface) {
	const { user } = useAuth();
	const { gameState } = useGame();
	const { snapshot } = useStatSnapshot();
	const router = useRouter();

	console.log(JSON.stringify(snapshot, undefined, 3));

	const statCardData: StatCardData[] = [
		{
			title: "Games",
			data: statSnapshot?.gamesPlayed ?? 0,
			subData: [],
			styles: statCardNumberStyles,
		},
		{
			title: "Wins",
			data: statSnapshot?.gamesWon ?? 0,
			subData: [],
			styles: statCardNumberStyles,
		},
		{
			title: "Decks",
			data: statSnapshot?.numDecks ?? 0,
			subData: [],
			styles: statCardNumberStyles,
		},
		{
			title: "Last Won",
			data: statSnapshot?.numDecks ?? 0,
			subData: [],
			styles: statCardNumberStyles,
		},
		{
			title: "Recently Played",
			data: `${"Atraxa, Grand Unifier"}`,
			subData: [`WIN`],
			styles: {
				main: "text-lg text-fg-light my-2",
				sub: "text-success font-bold tracking-wider",
			},
		},
		{
			title: "Most Played",
			data: `${"Urza, Lord High Artificer"}`,
			subData: ["Atraxa, Grand Unifier", "Sheoldred, the Apocalypse"],
			styles: statCardTextStyles,
		},
		{
			title: "Least Played",
			data: `${"Krenko, Mob Boxx"}`,
			subData: ["The Wandering Rescuer", "Jin-Gitaxias, Core Augur"],
			styles: statCardTextStyles,
		},
		{
			title: "Streaks",
			data: statSnapshot?.numDecks ?? 0,
			subData: [`Longest Win Streak: 10`, `Longest Loss Streak: 20`],
			styles: statCardTextStyles,
		},
	];

	function renderStatCards() {
		return statCardData.map((data) => (
			<StatCard key={data.title}>
				<h3>{data.title}</h3>
				<div className={data.styles?.main}>{data.data}</div>
				{data.subData.map((sub, i) => (
					<div key={i} className={data.styles?.sub}>{sub}</div>
				))}
			</StatCard>
		));
	}

	return (
		<DashboardLayout>
			<DashboardHeader user={user} title="Command Zone" />
			<DashboardMain styles="!items-center">
				<div className={`dashboard-main-content-layout ${styles.gridLayout} `}>
					{renderStatCards()}

					{/* Line Chart */}
					<StatCard
						styles="col-span-4"
						innerStyles="!px-2 !pt-4 !pb-0 !justify-start !items-stretch"
					>
						<LineChart height="350px" />
					</StatCard>

					{/* Donut Chart */}
					<StatCard
						styles="col-span-2"
						innerStyles="!px-2 !pt-4 !pb-4 !justify-center !items-stretch"
					>
						<PieChart />
					</StatCard>

					{/* Commander Showcase */}
					<StatCard styles="col-span-2">
						<h3 className="pb-4 mb-4 border-b border-surface-500 text-fg-light">
							Commander Showcase
						</h3>
						<div className="flex gap-6 h-full items-center lg:items-start flex-col lg:flex-row">
							<div className="flex flex-col justify-start grow max-w-[265px] h-full w-full">
								<div className="aspect-[5/7] relative rounded-xl overflow-hidden w-full">
									<Image
										src="https://cards.scryfall.io/large/front/7/b/7b7a348a-51f7-4dc5-8fe7-1c70fea5e050.jpg?1689996774"
										alt="Commander Card"
										fill={true}
									/>
								</div>
							</div>

							<div className="flex flex-col text-fg-light w-full gap-4 items-center lg:items-start shrink-[2]">
								<h3 className="hidden lg:block">Urza, Lord High Artificer</h3>

								<div className="w-[250px] lg:w-full lg:gap-4 flex flex-wrap -translate-x-2 lg:translate-x-0">
									<div className="flex flex-col w-1/2 lg:w-full items-center lg:items-start pb-4 lg:pb-0">
										<h4>Games</h4>
										<p className="text-lg">14</p>
									</div>

									<div className="flex flex-col w-1/2 lg:w-full lg:items-start items-center pb-4 lg:pb-0">
										<h4>Wins</h4>
										<p className="text-lg">14</p>
									</div>

									<div className="flex flex-col w-1/2 lg:w-full lg:items-start items-center">
										<h4>Streak</h4>
										<p
											className={`text-lg font-bold tracking-wider text-success`}
										>
											1
										</p>
									</div>

									<div className="flex flex-col w-1/2 lg:w-full lg:items-start items-center">
										<h4>Last Played</h4>
										<p>Feb 2, 2025</p>
									</div>
								</div>
							</div>
						</div>
					</StatCard>

					{/* Recent Game Log */}
					<StatCard
						styles="col-span-4 !hidden lg:!flex max-h-[29rem]"
						innerStyles="lg:justify-start h-full"
					>
						<h3 className="pb-4 mb-4 border-b border-surface-500">
							Recent Games
						</h3>
						<div className="overflow-y-auto flex flex-col gap-2 pr-2">
							{gameState.games.length > 0 &&
								gameState.games.map((data) => (
									<GameLogCard key={data.id} game={data} />
								))}
						</div>
					</StatCard>

					<div className="lg:hidden w-full">
						<div className="mx-10 mt-8">
							<ButtonPrimary
								onClick={() => router.push("/log")}
								style="transparent"
								uppercase={false}
							>
								View Games
							</ButtonPrimary>
						</div>
					</div>
				</div>
			</DashboardMain>
		</DashboardLayout>
	);
}
