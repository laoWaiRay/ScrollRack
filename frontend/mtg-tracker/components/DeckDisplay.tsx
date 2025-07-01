"use client";

import { DeckReadDTO } from "@/types/client";
import Drawer from "./Drawer";
import ButtonIcon from "@/components/ButtonIcon";
import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import { PickerValue } from "@mui/x-date-pickers/internals";
import {
	labelToPodSize,
	podSizeLabels,
} from "@/app/(dashboard)/commandzone/CommandZone";
import { defaultDeckStats } from "@/hooks/useDeck";
import DeckCard from "./DeckCard";
import Fuse from "fuse.js";
import Switch from "@/components/Switch";
import East from "@/public/icons/east.svg";
import Filter from "@/public/icons/filter.svg";
import Sort from "@/public/icons/sort.svg";
import ButtonPrimary from "./ButtonPrimary";
import DateSelect from "./DateSelect";
import FilterSortBar from "./FilterSortBar";
import DropdownMenu from "./DropdownMenu";
import LoadingSpinner from "./LoadingSpinner";

interface DeckDisplayInterface {
	decks: DeckReadDTO[];
	isLoading: boolean;
}

interface SortValues {
	dateCreated: "newest" | "oldest" | null;
	recentlyPlayed: "most" | "least" | null;
	numGames: "most" | "least" | null;
	winRate: "highest" | "lowest" | null;
	recentWins: "most recent" | "least recent" | null;
}

export default function DeckDisplay({
	decks,
	isLoading,
}: DeckDisplayInterface) {
	const [filter, setFilter] = useState("");
	const [filtered, setFiltered] = useState(decks);
	const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
	const [isSortDrawerOpen, setIsSortDrawerOpen] = useState(false);
	const [startDate, setStartDate] = useState<PickerValue>(dayjs());
	const [endDate, setEndDate] = useState<PickerValue>(dayjs());
	const [showAllDecks, setShowAllDecks] = useState(true);
	const [podSizeLabel, setPodSizeLabel] = useState(podSizeLabels[0]);

	const initialSortValues: SortValues = {
		dateCreated: "newest",
		recentlyPlayed: null,
		numGames: null,
		winRate: null,
		recentWins: null,
	};

	const [sortValues, setSortValues] = useState(initialSortValues);
	const { dateCreated, recentlyPlayed, numGames, winRate, recentWins } =
		sortValues;

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

	const deckToDeckStats = useCallback(
		(deck: DeckReadDTO) => {
			return (
				deck.statistics?.find((s) => s.podSize === podSize)?.stats ??
				defaultDeckStats
			);
		},
		[podSize]
	);

	const sortFormData = [
		{
			heading: "DATE CREATED",
			switches: [
				{
					name: "Newest First",
					enabled: dateCreated === "newest",
					setEnabled: () => updateValues("dateCreated", "newest", false),
				},
				{
					name: "Oldest First",
					enabled: dateCreated === "oldest",
					setEnabled: () => updateValues("dateCreated", "oldest", false),
				},
			],
		},
		{
			heading: "RECENTLY PLAYED",
			switches: [
				{
					name: "Most Recent First",
					enabled: recentlyPlayed === "most",
					setEnabled: () => {
						updateValues("recentlyPlayed", "most");
					},
				},
				{
					name: "Least Recent First",
					enabled: recentlyPlayed === "least",
					setEnabled: () => updateValues("recentlyPlayed", "least"),
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

	const sortRecentlyPlayed = useCallback(
		(a: DeckReadDTO, b: DeckReadDTO) => {
      if (!recentlyPlayed) {
        return 0;
      }
			const aStats = deckToDeckStats(a);
			const bStats = deckToDeckStats(b);
			if (!aStats || !bStats) {
				return 0;
			}

			if (aStats.lastPlayed == null && bStats.lastPlayed == null) {
				return 0;
			}

			const aTime = aStats.lastPlayed
				? new Date(aStats.lastPlayed).getTime()
				: -Infinity;
			const bTime = bStats.lastPlayed
				? new Date(bStats.lastPlayed).getTime()
				: -Infinity;

			switch (recentlyPlayed) {
				case "most":
					return bTime - aTime;
				case "least":
					return aTime - bTime;
				default:
					return 0;
			}
		},
		[deckToDeckStats, recentlyPlayed]
	);

	const sortNumGames = useCallback(
		(a: DeckReadDTO, b: DeckReadDTO) => {
      if (!numGames) {
        return 0;
      }
			const aStats = deckToDeckStats(a);
			const bStats = deckToDeckStats(b);
			if (!aStats || !bStats) {
				return 0;
			}

			switch (numGames) {
				case "most":
					return bStats.numGames - aStats.numGames;
				case "least":
					return aStats.numGames - bStats.numGames;
				default:
					return 0;
			}
		},
		[numGames, deckToDeckStats]
	);

	const sortWinRate = useCallback(
		(a: DeckReadDTO, b: DeckReadDTO) => {
      if (!winRate) {
        return 0;
      }
			const aStats = deckToDeckStats(a);
			const bStats = deckToDeckStats(b);
			if (!aStats || !bStats) {
				return 0;
			}
			if (aStats.numGames <= 0 && bStats.numGames <= 0) return 0;
			if (aStats.numGames <= 0) return 1;
			if (bStats.numGames <= 0) return -1;

			const aWinRate = aStats.numWins / aStats.numGames;
			const bWinRate = bStats.numWins / bStats.numGames;

			switch (winRate) {
				case "highest":
					return bWinRate - aWinRate;
				case "lowest":
					return aWinRate - bWinRate;
				default:
					return 0;
			}
		},
		[deckToDeckStats, winRate]
	);

	const sortDateCreated = useCallback(
		(a: DeckReadDTO, b: DeckReadDTO) => {
			switch (dateCreated) {
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
		},
		[dateCreated]
	);

	const sortRecentWins = useCallback(
		(a: DeckReadDTO, b: DeckReadDTO) => {
      if (!recentWins) {
        return 0;
      }
			const aStats = deckToDeckStats(a);
			const bStats = deckToDeckStats(b);
			if (!aStats || !bStats) {
				return 0;
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
		},
		[recentWins, deckToDeckStats]
	);

	const filterDeckByDateRange = useCallback(
		(toFilter: DeckReadDTO[]) => {
			if (!showAllDecks && startDate && endDate) {
				return toFilter.filter(
					(d) =>
						d.createdAt >= startDate.startOf("day").toISOString() &&
						d.createdAt <= endDate.endOf("day").toISOString()
				);
			}
			return toFilter;
		},
		[showAllDecks, startDate, endDate]
	);

	useEffect(() => {
		if (filter === "" || isFilterDrawerOpen) {
			return;
		}

		// Apply date filter here for filtered
		const timeFilteredDecks = filterDeckByDateRange(decks);

		const fuse = new Fuse(timeFilteredDecks, {
			keys: ["commander"],
			threshold: 0.3,
		});

		const searchResults = fuse.search(filter).map((result) => result.item);

		// Sort after applying fuzzy search filter
		searchResults.sort(
			(a, b) =>
				sortRecentlyPlayed(a, b) ||
				sortNumGames(a, b) ||
				sortWinRate(a, b) ||
				sortRecentWins(a, b) ||
				sortDateCreated(a, b)
		);

		setFiltered(searchResults);
	}, [
		filter,
		podSizeLabel,
		sortValues,
		startDate,
		endDate,
		isFilterDrawerOpen,
		decks,
		filterDeckByDateRange,
		sortDateCreated,
		sortNumGames,
		sortRecentWins,
		sortRecentlyPlayed,
		sortWinRate,
	]);

	function renderDeckCards() {
		if (decks.length === 0) {
			return <div className="mt-4 w-full flex justify-center">No Decks</div>;
		}

		if (filter !== "" && filtered.length > 0) {
			if (filtered.length === 0) {
				return <div className="mt-4 w-full flex justify-center">No Decks</div>;
			}

			return filtered.map((deck) => (
				<DeckCard key={deck.id} deck={deck} deckStats={deckToDeckStats(deck)} />
			));
		} else {
			// Apply date filter here for non-filtered decks
			const timeFilteredDecks = filterDeckByDateRange(decks);
			if (timeFilteredDecks.length === 0) {
				return <div className="mt-4 w-full flex justify-center">No Decks</div>;
			}

			// Apply sorting here for non-filtered decks
			timeFilteredDecks.sort(
				(a, b) =>
					sortRecentlyPlayed(a, b) ||
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
  
  useEffect(() => {
    setFiltered(decks);
  }, [decks])

	return (
		<div className="w-full flex justify-center mb-4">
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
											<Switch enabled={sw.enabled} setEnabled={sw.setEnabled} />
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
							<div className="flex gap-2 items-center z-10 relative">
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
		</div>
	);
}
