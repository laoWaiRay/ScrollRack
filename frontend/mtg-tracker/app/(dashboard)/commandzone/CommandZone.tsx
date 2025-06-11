"use client";
import styles from "../styles.module.css";
import pageStyles from "./styles.module.css";
import Bell from "@/public/icons/bell.svg";
import UserAdd from "@/public/icons/user-add.svg";
import ButtonIcon from "@/components/ButtonIcon";
import Tooltip from "@/components/Tooltip";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@headlessui/react";
import { DeckReadDTO, StatSnapshotDTO } from "@/types/client";
import StatCard from "@/components/StatCard";
import { GameLogCard } from "@/components/GameLogCard";
import ButtonPrimary from "@/components/ButtonPrimary";
import dynamic from "next/dynamic";
import PieChart from "@/components/PieChart";
import LineChart from "@/components/LineChart";

const Chart = dynamic(() => import("react-apexcharts"), {
	ssr: false, // Ensure ApexCharts is not imported during SSR
});

interface CommandZoneInterface {
	statSnapshot: StatSnapshotDTO | null;
	decks: DeckReadDTO[] | null;
}

export default function CommandZone({
	statSnapshot,
	decks,
}: CommandZoneInterface) {
	const { user } = useAuth();
	const buttonIconStyle = "p-1 mx-1 hover:text-fg-light";

	return (
		<div
			className={`${styles.gridB} flex flex-col items-center m-0 lg:m-4 min-h-dvh mt-24 lg:mt-4 mx-3`}
		>
			{/* Main Header */}
			<div className="border-b-2 border-surface-500 w-full pb-4 lg:pb-2.5 mb-2 lg:mb-4">
				<div className="flex justify-between items-center mx-4">
					<div className="text-lg font-semibold select-none">Command Zone</div>
					<div className="text-lg items-center justify-between hidden lg:flex">
						{/* User Controls */}
						<Tooltip text="Add Friends">
							<ButtonIcon onClick={() => {}} styles={buttonIconStyle}>
								<UserAdd className="w-[1.5em] h-[1.5em] stroke-1" />
							</ButtonIcon>
						</Tooltip>

						<Tooltip text="Notifications">
							<ButtonIcon onClick={() => {}} styles={buttonIconStyle}>
								<Bell className="w-[1.5em] h-[1.5em] stroke-1" />
							</ButtonIcon>
						</Tooltip>

						{/* User Profile Card  */}
						<Button
							className="flex items-center justify-center gap-3 py-2 px-3 ml-1 rounded
            data-hover:cursor-pointer data-hover:bg-surface-500"
						>
							<div className="w-[1.5em] h-[1.5em] d overflow-hidden">
								<Image
									className="h-full w-full object-cover"
									src="/mock/avatar.png"
									height={32}
									width={32}
									alt="User avatar"
								/>
							</div>
							<div className="text-base text-fg-light select-none">
								{user?.userName}
							</div>
						</Button>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="lg:h-full w-full lg:max-w-[1480px] flex justify-center items-center grow">
				<div
					className={`${pageStyles.gridLayout} flex flex-col gap-2 w-full items-center my-2`}
				>
					<StatCard>
						<div>Total Games</div>
						<div className="text-2xl text-fg-light my-2">
							{statSnapshot?.gamesPlayed}
						</div>
						<div className="text-fg-dark">this month: 0</div>
					</StatCard>
					<StatCard>
						<h3>Total Wins</h3>
						<div className="text-2xl text-fg-light my-2">
							{statSnapshot?.gamesWon}
						</div>
						<div className="text-fg-dark">this month: 0</div>
					</StatCard>
					<StatCard>
						<h3>Decks</h3>
						<div className="text-2xl text-fg-light my-2">
							{statSnapshot?.numDecks}
						</div>
						<div className="text-fg-dark">this month: 0</div>
					</StatCard>
					<StatCard>
						<h3>Most Played</h3>
						<div className="text-lg text-fg-light my-2">
							Urza, Lord High Artificer
						</div>
						<div className="text-fg-dark">
							this month: <br /> Atraxa, Grand Unifier
						</div>
					</StatCard>
					<StatCard>
						<h3>Recently Played</h3>
						<div className="text-lg text-fg-light my-2">
							Atraxa, Grand Unifier
						</div>
						<div className="text-success font-bold tracking-wider">WIN</div>
						{/* <div className="text-error font-bold tracking-wider">LOSS</div> */}
					</StatCard>

					<StatCard
						styles="col-span-3"
						innerStyles="!px-2 !pt-4 !pb-0 !justify-start !items-stretch"
					>
						<LineChart height="350px" />
					</StatCard>

					<StatCard
						styles="col-span-2"
						innerStyles="!px-2 !pt-4 !pb-4 !justify-center !items-stretch"
					>
						<PieChart height="350px" />
					</StatCard>

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
								<h3 className="hidden lg:block">
									Urza, Lord High Artificer
								</h3>

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

					<StatCard
						styles="col-span-3 !hidden lg:!flex"
						innerStyles="lg:justify-start h-full"
					>
						<h3 className=" pb-4 mb-4 border-b border-surface-500">
							Recent Games
						</h3>
						<div className="overflow-y-auto pl-2 pr-4">
							{[...Array(10)].map((_, i) => (
								<GameLogCard
									key={i}
									gameData={{
										date: "Feb 1, 2025",
										commander: "Atraxa, Praetor's Voice",
										players: "4",
										winner: "WORD_WRONG",
									}}
								/>
							))}
						</div>
					</StatCard>

					<div className="lg:hidden w-full">
						<div className="mx-10">
							<ButtonPrimary onClick={() => {}}>View Game Log</ButtonPrimary>
						</div>
					</div>

					{/* <p className="">{JSON.stringify(user, null, 3)}</p>
        <p className="">{JSON.stringify(statSnapshot, null, 3)}</p>
        <p className="">{JSON.stringify(decks, null, 3)}</p> */}
				</div>
			</div>
		</div>
	);
}
