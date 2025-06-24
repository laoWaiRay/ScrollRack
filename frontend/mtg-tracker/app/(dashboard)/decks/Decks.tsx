"use client";
import ButtonIcon from "@/components/ButtonIcon";
import ButtonLink from "@/components/ButtonLink";
import {
	DashboardLayout,
	DashboardHeader,
	DashboardMain,
} from "@/components/Dashboard";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import Add from "@/public/icons/add.svg";
import Edit from "@/public/icons/edit.svg";
import DeckCard from "@/components/DeckCard";
import Fuse from "fuse.js";
import { useDeck } from "@/hooks/useDeck";
import FilterSortBar from "@/components/FilterSortBar";
import Drawer from "@/components/Drawer";
import Switch from "@/components/Switch";
import East from "@/public/icons/east.svg";
import { DeckReadDTO } from "@/types/client";

interface DecksInterface {}

interface SortValues {
	recency: "newest" | "oldest" | null;
	numGames: "most" | "least" | null;
	winRate: "highest" | "lowest" | null;
}

export default function Decks({}: DecksInterface) {
	const { user } = useAuth();
	const { decks, dispatch } = useDeck();
	const [filter, setFilter] = useState("");
	const [filtered, setFiltered] = useState(decks);
	const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
	const [isSortDrawerOpen, setIsSortDrawerOpen] = useState(false);

	const initialSortValues: SortValues = {
		recency: "newest",
		numGames: null,
		winRate: null,
	};

	const [sortValues, setSortValues] = useState(initialSortValues);
	const { recency, numGames, winRate } = sortValues;

	type ValueOf<T> = T[keyof T];
	function updateValues(
		key: keyof SortValues,
		value: ValueOf<SortValues>,
		allowNull: boolean = true
	) {
		if (allowNull) {
			if (sortValues[key] == value) {
				setSortValues((prev) => ({ ...prev, [key]: null }));
			} else {
				setSortValues((prev) => ({ ...prev, [key]: value }));
			}
		} else {
			setSortValues((prev) => ({ ...prev, [key]: value }));
		}
	}

	const sortFormData = [
		{
			heading: "RECENCY",
			switches: [
				{
					name: "Newest First",
					enabled: recency === "newest",
					setEnabled: () => updateValues("recency", "newest", false),
				},
				{
					name: "Oldest First",
					enabled: recency === "oldest",
					setEnabled: () => updateValues("recency", "oldest", false),
				},
			],
		},
		{
			heading: "NUMBER OF GAMES",
			switches: [
				{
					name: "Most First",
					enabled: numGames === "most",
					setEnabled: () => {
						updateValues("numGames", "most");
					},
				},
				{
					name: "Least First",
					enabled: numGames === "least",
					setEnabled: () => updateValues("numGames", "least"),
				},
			],
		},
		{
			heading: "WIN RATE",
			switches: [
				{
					name: "Highest First",
					enabled: winRate === "highest",
					setEnabled: () => updateValues("winRate", "highest"),
				},
				{
					name: "Lowest First",
					enabled: winRate === "lowest",
					setEnabled: () => updateValues("winRate", "lowest"),
				},
			],
		},
	];

	const sortNumGames = (a: DeckReadDTO, b: DeckReadDTO) => {
		switch (numGames) {
			case "most":
				return b.numGames - a.numGames;
			case "least":
				return a.numGames - b.numGames;
			default:
				return null;
		}
	};

	const sortWinRate = (a: DeckReadDTO, b: DeckReadDTO) => {
		switch (winRate) {
			case "highest":
				return b.numWins - a.numWins;
			case "lowest":
				return a.numWins - b.numWins;
			default:
				return null;
		}
	};

	const sortRecency = (a: DeckReadDTO, b: DeckReadDTO) => {
		switch (recency) {
			case "newest":
				return -1 * a.createdAt.localeCompare(b.createdAt);
			case "oldest":
				return a.createdAt.localeCompare(b.createdAt);
			default:
				return 0;
		}
	};

	useEffect(() => {
		if (filter === "") {
			return;
		}

		// Apply sorting here for filtered decks, before filtering
		decks.sort(
			(a, b) => sortNumGames(a, b) || sortWinRate(a, b) || sortRecency(a, b)
		);

		const fuse = new Fuse(decks, {
			keys: ["commander"],
		});

		setFiltered(fuse.search(filter).map((result) => result.item));
	}, [filter]);

	function renderDeckCards() {
		if (decks.length === 0) {
			return <div className="mt-4 w-full flex justify-center">No Decks</div>;
		}

		if (filter !== "" && filtered.length > 0) {
			return filtered.map((deck) => <DeckCard key={deck.id} deck={deck} />);
		} else {
			// Apply sorting here for non-filtered decks
			decks.sort(
				(a, b) => sortNumGames(a, b) || sortWinRate(a, b) || sortRecency(a, b)
			);

			return decks.map((deck) => <DeckCard key={deck.id} deck={deck} />);
		}
	}

	return (
		<DashboardLayout>
			<DashboardHeader title="Decks" user={user} align={"left"}>
				<div className="flex gap-4">
					<ButtonLink
						href="/decks/edit"
						style="transparent"
						styles="border border-surface-500"
						uppercase={false}
					>
						<div className="flex items-center gap-2">
							<span>Edit</span>
							<div className="size-[1em] text-white stroke-1">
								<Edit />
							</div>
						</div>
					</ButtonLink>
					<ButtonLink href="/decks/add" uppercase={false}>
						<div className="flex items-center gap-1">
							<span>New</span>
							<div className="size-[1.3em] text-white stroke-1">
								<Add />
							</div>
						</div>
					</ButtonLink>
				</div>
			</DashboardHeader>
			<DashboardMain>
				{/* Hidden Sort Drawer */}
				<Drawer isDrawerOpen={isSortDrawerOpen} zIndex="z-80">
					{/* Back Button */}
					<div className="self-end mr-10">
						<ButtonIcon onClick={() => setIsSortDrawerOpen(false)}>
							<div className="size-12 border border-fg p-2.5 rounded-full">
								<East />
							</div>
						</ButtonIcon>
					</div>

					<section className="flex flex-col mt-6 mx-8">
						<h3 className="flex justify-center mb-4">SORTING</h3>
						<div className="flex flex-col gap-6">
							{sortFormData.map((data) => (
								<div key={data.heading}>
									<h4 className="mb-2 font-semibold">{data.heading}</h4>
									<div className="flex flex-col gap-4">
										{data.switches.map((sw) => (
											<div className="flex justify-between px-2" key={sw.name}>
												<div>{sw.name}</div>
												<Switch
													enabled={sw.enabled}
													setEnabled={sw.setEnabled}
												/>
											</div>
										))}
									</div>
								</div>
							))}
						</div>
					</section>
				</Drawer>

				<div className={`dashboard-main-content-layout max-w-lg lg:max-w-3xl`}>
					<div className="flex flex-col w-full gap-4">
						<FilterSortBar
							filter={filter}
							setFilter={setFilter}
							onSortClick={() => setIsSortDrawerOpen(true)}
							onFilterClick={() => setIsFilterDrawerOpen(true)}
						/>

						<section className="w-full flex flex-col gap-2 px-2">
							{renderDeckCards()}
						</section>
					</div>
				</div>
			</DashboardMain>
		</DashboardLayout>
	);
}
