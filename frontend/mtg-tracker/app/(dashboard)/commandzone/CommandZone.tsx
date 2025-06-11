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
import {
  BLACK,
	BLUE,
	BLUE2,
	BLUE3,
	BLUE5,
	GREEN,
	GREEN2,
	GREEN3,
	GREEN5,
	RED,
	RED2,
	RED3,
	RED5,
	WHITE,
} from "@/constants/colors";

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
  
	const pieChartConfig = {
		type: "donut",
		series: [1,1,1,1,1,1,1,1,1,1],
		options: {
			labels: ["Sheoldred", "Atraxa", "Jin-Gitaxias", "Urabrask", "Vorinclex", "Urza, Lord High Artificer", 
        "Wilson, Refined Grizzly", "Traxos, Scourge of Kroog", "The Prismatic Bridge", "Mr. House",
        "Chun Li", "Jon Irenicus"],
			chart: {
				toolbar: {
					show: false,
				},
			},
			title: {
				text: "Decks Played",
				align: "center",
				style: {
					fontSize: "16px",
					fontWeight: "normal",
					fontFamily: "inherit",
					color: WHITE,
				},
			},
			dataLabels: {
				enabled: false,
			},
			colors: [BLACK, WHITE, BLUE, RED, BLUE, GREEN, WHITE, WHITE, WHITE],
      tooltip: {
        enabled: true,
        fillSeriesColor: false,
        theme: "dark"
      },
      stroke: {
        colors: ["#121212"],
        width: 4
      },
			legend: {
				show: true,
        position: "bottom",
				labels: {
					colors: WHITE,
				},
        offsetY: 2,
			},
      responsive: [
        {
          breakpoint: 1024,
          height: "480px",
          options: {
            legend: {
              position: "bottom"
            }
          }
        }
      ]
		},
	};

	const lineChartConfig = {
		type: "line",
		series: [
			{
				name: "Played",
				data: [6, 2, 3, 8, 1, 4, 2, 5, 6, 10, 5, 2],
			},
			{
				name: "Win",
				data: [3, 1, 2, 5, 0, 3, 0, 2, 3, 5, 3, 2],
			},
			{
				name: "Loss",
				data: [3, 1, 1, 3, 1, 1, 2, 3, 3, 5, 2, 0],
			},
		],
		options: {
			chart: {
				toolbar: {
					show: false,
				},
			},
			title: {
				text: "Game History",
				align: "center",
				style: {
					fontSize: "16px",
					fontWeight: "normal",
					fontFamily: "inherit",
					color: WHITE,
				},
			},
			dataLabels: {
				enabled: false,
			},
			legend: {
				show: true,
				labels: {
					colors: WHITE,
				},
			},
			colors: [BLUE, GREEN, RED],
			stroke: {
				lineCap: "round",
				curve: "smooth",
			},
			markers: {
				size: 0,
			},
			xaxis: {
				axisTicks: {
					show: true,
				},
				axisBorder: {
					show: false,
				},
				labels: {
					style: {
						colors: WHITE,
						fontSize: "1em",
						fontFamily: "inherit",
						fontWeight: "inherit",
					},
				},
				categories: [
					"Jan",
					"Feb",
					"Mar",
					"Apr",
					"May",
					"Jun",
					"Jul",
					"Aug",
					"Sep",
					"Oct",
					"Nov",
					"Dec",
				],
			},
			yaxis: {
				labels: {
					style: {
						colors: WHITE,
						fontSize: "1em",
						fontFamily: "inherit",
						fontWeight: "inherit",
					},
				},
			},
			grid: {
				show: true,
				borderColor: "#dddddd",
				strokeDashArray: 1,
				xaxis: {
					lines: {
						show: false,
					},
				},
				padding: {
					top: 5,
					right: 20,
				},
			},
			fill: {
				opacity: 0.8,
			},
			tooltip: {
				theme: "dark",
			},
		},
	};

	return (
		<div
			className={`${styles.gridB} flex flex-col items-center m-0 lg:m-4 min-h-dvh mt-24 lg:mt-4`}
		>
			{/* Main Header */}
			<div className="border-b-2 border-surface-500 w-full pb-4 lg:pb-2.5">
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
							<div className="text-base select-none">{user?.userName}</div>
						</Button>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="lg:h-full w-full lg:max-w-[1480px] flex justify-center items-center grow">
				<div
					className={`${pageStyles.gridLayout} flex flex-col gap-2 m-2 lg:m-4 w-full items-center`}
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

					<StatCard styles="col-span-3" innerStyles="!px-2 !pt-6 !pb-0 !justify-start !items-stretch">
						<Chart {...lineChartConfig} width={"100%"} height={"350px"} />
					</StatCard>

					<StatCard styles="col-span-2" innerStyles="!px-2 !pt-6 !pb-0 !justify-center !items-stretch">
						<Chart {...pieChartConfig} width={"100%"} height={"350px"} />
					</StatCard>

					<StatCard styles="col-span-2">
						<div className="flex gap-6 h-full items-start">
							<div className="flex flex-col justify-start grow max-w-[295px] h-full">
								<h3 className="mb-4 text-fg-light">Commander Showcase</h3>
								<div className="w-full aspect-[5/7] relative rounded-xl overflow-hidden">
									<Image
										src="https://cards.scryfall.io/large/front/7/b/7b7a348a-51f7-4dc5-8fe7-1c70fea5e050.jpg?1689996774"
										alt="Commander Card"
										fill={true}
									/>
								</div>
							</div>

							<div className="flex flex-col justify-between text-fg-light">
								<h3 className="mb-4">Urza, Lord High Artificer</h3>
								<h4>Games</h4>
								<p className="text-lg">14</p>
								<h4>Wins</h4>
								<p className="text-lg">14</p>
								<h4>Streak</h4>
								<p className={`text-lg font-bold tracking-wider text-success`}>
									1
								</p>
								<h4>Last Played</h4>
								<p>Feb 2, 2025</p>
							</div>
						</div>
					</StatCard>

					<StatCard styles="col-span-3 max-h-[45vh] overflow-auto !hidden lg:!flex">
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
