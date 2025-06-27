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
import { defaultDeckStats, useDeck } from "@/hooks/useDeck";
import FilterSortBar from "@/components/FilterSortBar";
import Drawer from "@/components/Drawer";
import Switch from "@/components/Switch";
import East from "@/public/icons/east.svg";
import { DeckReadDTO } from "@/types/client";
import DateSelect from "@/components/DateSelect";
import { PickerValue } from "@mui/x-date-pickers/internals";
import dayjs from "dayjs";
import ButtonPrimary from "@/components/ButtonPrimary";
import LoadingSpinner from "@/components/LoadingSpinner";
import { labelToPodSize, podSizeLabels } from "../commandzone/CommandZone";
import DropdownMenu from "@/components/DropdownMenu";
import Sort from "@/public/icons/sort.svg";
import Filter from "@/public/icons/filter.svg";

interface DecksInterface {}

interface SortValues {
	recency: "newest" | "oldest" | null;
	numGames: "most" | "least" | null;
	winRate: "highest" | "lowest" | null;
	recentWins: "most recent" | "least recent" | null;
}

export default function Decks({}: DecksInterface) {
	const { user } = useAuth();
	const { decks, isLoading } = useDeck();
	const [filter, setFilter] = useState("");
	const [filtered, setFiltered] = useState(decks);
	const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
	const [isSortDrawerOpen, setIsSortDrawerOpen] = useState(false);
	const [startDate, setStartDate] = useState<PickerValue>(dayjs());
	const [endDate, setEndDate] = useState<PickerValue>(dayjs());
	const [showAllDecks, setShowAllDecks] = useState(true);
	const [podSizeLabel, setPodSizeLabel] = useState(podSizeLabels[0]);

	const initialSortValues: SortValues = {
		recency: "newest",
		numGames: null,
		winRate: null,
		recentWins: null,
	};

	const [sortValues, setSortValues] = useState(initialSortValues);
	const { recency, numGames, winRate, recentWins } = sortValues;

	type ValueOf<T> = T[keyof T];
	function updateValues(
		key: keyof SortValues,
		value: ValueOf<SortValues>,
		allowNull: boolean = true
	) {
		if (allowNull && sortValues[key] == value) {
			setSortValues((prev) => ({ ...prev, [key]: null }));
		} else {
			setSortValues((prev) => ({ ...prev, [key]: value }));
		}
	}

	const podSize = labelToPodSize[podSizeLabel];

	function deckToDeckStats(deck: DeckReadDTO) {
		return (
			deck.statistics?.find((s) => s.podSize === podSize)?.stats ??
			defaultDeckStats
		);
	}

	const sortFormData = [
		{
			heading: "DATE CREATED",
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
		{
			heading: "RECENT WINS",
			switches: [
				{
					name: "Most Recent First",
					enabled: recentWins === "most recent",
					setEnabled: () => updateValues("recentWins", "most recent"),
				},
				{
					name: "Least Recent First",
					enabled: recentWins === "least recent",
					setEnabled: () => updateValues("recentWins", "least recent"),
				},
			],
		},
	];

	const sortNumGames = (a: DeckReadDTO, b: DeckReadDTO) => {
		const aStats = deckToDeckStats(a);
		const bStats = deckToDeckStats(a);
		if (!aStats || !bStats) {
			return null;
		}

		switch (numGames) {
			case "most":
				return bStats.numGames - aStats.numGames;
			case "least":
				return aStats.numGames - bStats.numGames;
			default:
				return null;
		}
	};

	const sortWinRate = (a: DeckReadDTO, b: DeckReadDTO) => {
		const aStats = deckToDeckStats(a);
		const bStats = deckToDeckStats(a);
		if (!aStats || !bStats) {
			return null;
		}

		switch (winRate) {
			case "highest":
				return bStats.numWins - aStats.numWins;
			case "lowest":
				return aStats.numWins - bStats.numWins;
			default:
				return null;
		}
	};

	const sortDateCreated = (a: DeckReadDTO, b: DeckReadDTO) => {
		switch (recency) {
			case "newest":
				return (
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				);
			case "oldest":
				return (
					new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
				);
			default:
				return 0;
		}
	};

	const sortRecentWins = (a: DeckReadDTO, b: DeckReadDTO) => {
		const aStats = deckToDeckStats(a);
		const bStats = deckToDeckStats(b);
		if (!aStats || !bStats) {
			return null;
		}

		switch (recentWins) {
			case "most recent":
				if (aStats.latestWin == null && bStats.latestWin == null) {
					return 0;
				} else if (aStats.latestWin == null) {
					return 1;
				} else if (bStats.latestWin == null) {
					return -1;
				} else {
					return (
						new Date(bStats.latestWin).getTime() -
						new Date(aStats.latestWin).getTime()
					);
				}
			case "least recent":
				if (aStats.latestWin == null && bStats.latestWin == null) {
					return 0;
				} else if (aStats.latestWin == null) {
					return -1;
				} else if (bStats.latestWin == null) {
					return 1;
				} else {
					return (
						new Date(aStats.latestWin).getTime() -
						new Date(bStats.latestWin).getTime()
					);
				}
			default:
				return 0;
		}
	};

	const filterDeckByDateRange = (toFilter: DeckReadDTO[]) => {
		if (!showAllDecks && startDate && endDate) {
			return toFilter.filter(
				(d) =>
					d.createdAt >= startDate.startOf("day").toISOString() &&
					d.createdAt <= endDate.endOf("day").toISOString()
			);
		}
		return toFilter;
	};

	useEffect(() => {
		if (filter === "") {
			return;
		}

		// Apply date filter here for filtered
		const timeFilteredDecks = filterDeckByDateRange(decks);

		// Apply sorting here for filtered decks, before filtering
		timeFilteredDecks.sort(
			(a, b) =>
				sortNumGames(a, b) ||
				sortWinRate(a, b) ||
				sortRecentWins(a, b) ||
				sortDateCreated(a, b)
		);

		const fuse = new Fuse(timeFilteredDecks, {
			keys: ["commander"],
		});

		setFiltered(fuse.search(filter).map((result) => result.item));
	}, [filter]);

	function renderDeckCards() {
		if (decks.length === 0) {
			return <div className="mt-4 w-full flex justify-center">No Decks</div>;
		}

		if (filter !== "" && filtered.length > 0) {
			return filtered.map((deck) => (
				<DeckCard key={deck.id} deck={deck} deckStats={deckToDeckStats(deck)} />
			));
		} else {
			// Apply date filter here for non-filtered decks
			const timeFilteredDecks = filterDeckByDateRange(decks);

			// Apply sorting here for non-filtered decks
			timeFilteredDecks.sort(
				(a, b) =>
					sortNumGames(a, b) ||
					sortWinRate(a, b) ||
					sortRecentWins(a, b) ||
					sortDateCreated(a, b)
			);

			return timeFilteredDecks.map((deck) => (
				<DeckCard key={deck.id} deck={deck} deckStats={deckToDeckStats(deck)} />
			));
		}
	}

	function resetSortToDefault() {
		setSortValues(initialSortValues);
	}

	function resetTimeFilterToDefault() {
		setShowAllDecks(true);
		setStartDate(dayjs());
		setEndDate(dayjs());
	}

	return (
		<DashboardLayout>
			<DashboardHeader title="Decks" user={user}>
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

						<ButtonPrimary
							onClick={() => {
								setIsSortDrawerOpen(false);
								resetSortToDefault();
							}}
							style="transparent"
              styles="mt-8"
              uppercase={false}
						>
							Reset To Default
						</ButtonPrimary>
						<ButtonPrimary
							onClick={() => {
								setIsSortDrawerOpen(false);
							}}
							style="transparent"
              uppercase={false}
              styles="mt-0"
						>
							Back
						</ButtonPrimary>
					</section>
				</Drawer>

				{/* Hidden Date Selection Drawer */}
				<Drawer isDrawerOpen={isFilterDrawerOpen} zIndex="z-80">
					{/* Back Button */}
					<div className="self-end mr-10">
						<ButtonIcon onClick={() => setIsFilterDrawerOpen(false)}>
							<div className="size-12 border border-fg p-2.5 rounded-full">
								<East />
							</div>
						</ButtonIcon>
					</div>

					<section className="flex flex-col mt-6 mx-8 gap-8 items-center">
						<h2>TIME</h2>

						<div className="flex flex-col gap-6 w-full">
							<div className="flex justify-between px-2 w-full">
								<div>Show all Decks</div>
								<Switch
									enabled={showAllDecks}
									setEnabled={() => setShowAllDecks(true)}
								/>
							</div>

							<div className="flex justify-between px-2 w-full">
								<div>Filter Decks by Creation Date</div>
								<Switch
									enabled={!showAllDecks}
									setEnabled={() => setShowAllDecks(false)}
								/>
							</div>
						</div>

						<div className="mt-6">
							<h3 className="flex justify-center mb-4">STARTING FROM</h3>
							<div className="flex flex-col gap-6">
								<DateSelect
									value={startDate}
									setValue={setStartDate}
									disabled={showAllDecks}
								/>
							</div>
						</div>

						<div className="">
							<h3 className="flex justify-center mb-4">UNTIL</h3>
							<div className="flex flex-col gap-6">
								<DateSelect
									value={endDate}
									setValue={setEndDate}
									disabled={showAllDecks}
									minDate={dayjs(startDate)}
								/>
							</div>
						</div>

						<ButtonPrimary
							onClick={() => {
								setIsFilterDrawerOpen(false);
								resetTimeFilterToDefault();
							}}
							style="transparent"
							uppercase={false}
						>
							Reset To Default
						</ButtonPrimary>

						<ButtonPrimary
							onClick={() => {
								setIsFilterDrawerOpen(false);
							}}
							style="transparent"
							uppercase={false}
							styles="-mt-8"
						>
							Back
						</ButtonPrimary>
					</section>
				</Drawer>

				<div className={`dashboard-main-content-layout max-w-lg lg:max-w-3xl`}>
					<div className="flex flex-col w-full gap-4">
						<section className="w-full flex flex-col gap-4">
							<FilterSortBar
								filter={filter}
								setFilter={setFilter}
								useFilterButton={false}
								useSortButton={false}
							/>
							<div className="w-full flex justify-between lg:justify-start lg:gap-4 pl-4 pr-2">
								<div className="flex gap-2 items-center">
									<span className="text-sm">Pod Size</span>
									<DropdownMenu
										options={podSizeLabels}
										selected={podSizeLabel}
										setSelected={setPodSizeLabel}
									/>
								</div>

								<div className="flex items-center gap-2">
									<ButtonIcon onClick={() => setIsSortDrawerOpen(true)}>
										<div className="w-[2.5em] border border-surface-500 rounded p-1">
											<Sort />
										</div>
									</ButtonIcon>
									<ButtonIcon onClick={() => setIsFilterDrawerOpen(true)}>
										<div className="w-[2.5em] border border-surface-500 rounded p-2">
											<Filter />
										</div>
									</ButtonIcon>
								</div>
							</div>
						</section>

						<section className="w-full flex flex-col gap-2 px-2">
							{isLoading ? <LoadingSpinner /> : renderDeckCards()}
						</section>
					</div>
				</div>
			</DashboardMain>
		</DashboardLayout>
	);
}
