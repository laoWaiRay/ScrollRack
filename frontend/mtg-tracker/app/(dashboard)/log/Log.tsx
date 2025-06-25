"use client";
import { getGames } from "@/actions/games";
import ButtonIcon from "@/components/ButtonIcon";
import ButtonPrimary from "@/components/ButtonPrimary";
import {
	DashboardLayout,
	DashboardHeader,
	DashboardMain,
} from "@/components/Dashboard";
import DateSelect from "@/components/DateSelect";
import FilterSortBar from "@/components/FilterSortBar";
import { GameLogCard } from "@/components/GameLogCard";
import { ActionType, GameState } from "@/context/GameContext";
import { useAuth } from "@/hooks/useAuth";
import { useGame } from "@/hooks/useGame";
import useToast from "@/hooks/useToast";
import Switch from "@/components/Switch";
import Drawer from "@/components/Drawer";
import dayjs from "dayjs";
import Fuse from "fuse.js";
import { useEffect, useState } from "react";
import East from "@/public/icons/east.svg";

interface LogInterface {}

interface DateFilters {
  showAllDates: boolean;
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
}

const initialDateFilters: DateFilters = {
	showAllDates: true,
	startDate: dayjs(),
	endDate: dayjs(),
};

export default function Log({}: LogInterface) {
	const { user } = useAuth();
	const { gameState, dispatch: dispatchGameState } = useGame();
	const [filter, setFilter] = useState("");
	const [dateFilters, setDateFilters] = useState(initialDateFilters);
	const [draftDateFilters, setDraftDateFilters] = useState(dateFilters);
	const [filtered, setFiltered] = useState(gameState.games);
	const { toast } = useToast();
	const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

	async function handleLoadMore() {
		if (!gameState.hasMore) {
			console.log("No more games to load");
			return;
		}

		try {
			let nextGames: GameState | null = null;
			const { showAllDates, startDate, endDate } = dateFilters;
      setIsFetching(true);

			if (showAllDates) {
				nextGames = await getGames(gameState.page + 1);
			} else {
				nextGames = await getGames(
					gameState.page + 1,
					startDate.startOf("day").toISOString(),
					endDate.endOf("day").toISOString()
				);
			}

			dispatchGameState({ type: ActionType.APPEND, payload: nextGames.games });
			dispatchGameState({ type: ActionType.SET_PAGE, payload: nextGames.page });
			dispatchGameState({
				type: ActionType.SET_HAS_MORE,
				payload: nextGames.hasMore,
			});
      
      setIsFetching(false);
		} catch (error) {
			toast("Something went wrong fetching more games", "warn");
      setIsFetching(false);
		}
	}

	function resetDateFilters() {
		setDateFilters(initialDateFilters);
    updateGames(initialDateFilters);
	}

	async function handleSaveTimeFilter() {
		setDateFilters(draftDateFilters);
    updateGames(draftDateFilters);
	}

	async function updateGames({ showAllDates, startDate, endDate }: DateFilters) {
		let updatedGames: GameState | null = null;

		if (showAllDates) {
			updatedGames = await getGames(0);
		} else {
			updatedGames = await getGames(
				0,
				startDate.startOf("day").toISOString(),
				endDate.endOf("day").toISOString()
			);
		}

		dispatchGameState({
			type: ActionType.UPDATE,
			payload: updatedGames.games,
		});
		dispatchGameState({
			type: ActionType.SET_PAGE,
			payload: updatedGames.page,
		});
		dispatchGameState({
			type: ActionType.SET_HAS_MORE,
			payload: updatedGames.hasMore,
		});
	}

	useEffect(() => {
		if (filter === "") {
			return;
		}

		const fuse = new Fuse(gameState.games, {
			keys: [
				{
					name: "commanderName",
					getFn: (game) =>
						game.gameParticipations?.find((gp) => gp.userId === user?.id)?.deck
							.commander ?? "",
				},
			],
		});

		setFiltered(fuse.search(filter).map((result) => result.item));
	}, [filter, gameState]);

	useEffect(() => {
		if (isFilterDrawerOpen) {
			setDraftDateFilters(dateFilters);
		}
	}, [isFilterDrawerOpen]);

	function renderLogs() {
		if (gameState.games.length === 0) {
			return <div className="mt-4 w-full flex justify-center">No Games</div>;
		}

		if (filter !== "" && filtered.length > 0) {
			return filtered.map((data) => (
				<GameLogCard key={data.id} game={data} showButtons={true} />
			));
		}

		return gameState.games.map((data) => (
			<GameLogCard key={data.id} game={data} showButtons={true} />
		));
	}
  
  // Set client state back to default on dismount
  useEffect(() => {
    return () => {
      (async function () {
        await updateGames(initialDateFilters);
      })()
    }
  }, [])

	return (
		<DashboardLayout>
			<DashboardHeader title="Game Log" user={user}></DashboardHeader>
			<DashboardMain>
				<div className={`dashboard-main-content-layout max-w-lg lg:max-w-4xl`}>
					{/* Hidden Date Selection Drawer */}
					<Drawer isDrawerOpen={isFilterDrawerOpen} zIndex="z-80">
						{/* Back Button */}
						<div className="self-end mr-10">
							<ButtonIcon
								onClick={() => {
									setIsFilterDrawerOpen(false);
								}}
							>
								<div className="size-12 border border-fg p-2.5 rounded-full">
									<East />
								</div>
							</ButtonIcon>
						</div>

						<section className="flex flex-col mt-6 mx-8 gap-8 items-center">
							<h2>TIME</h2>

							<div className="flex flex-col gap-6 w-full">
								<div className="flex justify-between px-2 w-full">
									<div>Show all Games</div>
									<Switch
										enabled={draftDateFilters.showAllDates}
										setEnabled={() =>
											setDraftDateFilters((prev) => ({
												...prev,
												showAllDates: true,
											}))
										}
									/>
								</div>

								<div className="flex justify-between px-2 w-full">
									<div>Filter Games by Date</div>
									<Switch
										enabled={!draftDateFilters.showAllDates}
										setEnabled={() =>
											setDraftDateFilters((prev) => ({
												...prev,
												showAllDates: false,
											}))
										}
									/>
								</div>
							</div>

							<div className="mt-6">
								<h3 className="flex justify-center mb-4">STARTING FROM</h3>
								<div className="flex flex-col gap-6">
									<DateSelect
										value={draftDateFilters.startDate}
										setValue={(value) => {
											const selected =
												typeof value === "function"
													? value(draftDateFilters.startDate)
													: value;

											setDraftDateFilters((prev) => ({
												...prev,
												startDate: selected as dayjs.Dayjs,
											}));
										}}
										disabled={draftDateFilters.showAllDates}
									/>
								</div>
							</div>

							<div className="">
								<h3 className="flex justify-center mb-4">UNTIL</h3>
								<div className="flex flex-col gap-6">
									<DateSelect
										value={draftDateFilters.endDate}
										setValue={(value) => {
											const selected =
												typeof value === "function"
													? value(draftDateFilters.endDate)
													: value;

											setDraftDateFilters((prev) => ({
												...prev,
												endDate: selected as dayjs.Dayjs,
											}));
										}}
										disabled={draftDateFilters.showAllDates}
										minDate={dayjs(draftDateFilters.startDate)}
									/>
								</div>
							</div>

							<div className="w-full">
								<ButtonPrimary
									onClick={() => {
										handleSaveTimeFilter();
										setIsFilterDrawerOpen(false);
									}}
									style="transparent"
									uppercase={false}
								>
									Save Changes
								</ButtonPrimary>
								<ButtonPrimary
									onClick={() => {
										resetDateFilters();
										setIsFilterDrawerOpen(false);
									}}
									style="transparent"
									uppercase={false}
								>
									Reset To Default
								</ButtonPrimary>
							</div>
						</section>
					</Drawer>
					<div className="flex flex-col w-full gap-4">
						<FilterSortBar
							filter={filter}
							setFilter={setFilter}
							onFilterClick={() => setIsFilterDrawerOpen(true)}
							useSortButton={false}
						/>

						<section className="w-full flex flex-col gap-2 lg:gap-4 px-2">
							{renderLogs()}
							<div className="mx-8 mt-4" hidden={!gameState.hasMore}>
								<ButtonPrimary
									onClick={handleLoadMore}
									style="transparent"
									uppercase={false}
                  disabled={isFetching}
								>
									Load More
								</ButtonPrimary>
							</div>
						</section>
					</div>
				</div>
			</DashboardMain>
		</DashboardLayout>
	);
}
