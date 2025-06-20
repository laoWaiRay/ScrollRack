"use client";
import ButtonIcon from "@/components/ButtonIcon";
import ButtonLink from "@/components/ButtonLink";
import {
	DashboardLayout,
	DashboardHeader,
	DashboardMain,
} from "@/components/Dashboard";
import SearchBar from "@/components/SearchBar";
import { useAuth } from "@/hooks/useAuth";
import { DeckReadDTO } from "@/types/client";
import { useEffect, useState } from "react";
import Sort from "@/public/icons/sort.svg";
import Filter from "@/public/icons/filter.svg";
import Add from "@/public/icons/add.svg";
import Edit from "@/public/icons/edit.svg";
import DeckCard from "@/components/DeckCard";
import Fuse from "fuse.js";

interface DecksInterface {
	decks: DeckReadDTO[];
}

export default function Decks({ decks }: DecksInterface) {
	const { user } = useAuth();
	const [filter, setFilter] = useState("");
	const [filtered, setFiltered] = useState(decks);

	useEffect(() => {
		if (filter === "") {
			return;
		}

		const fuse = new Fuse(decks, {
			keys: ["commander"],
		});

		setFiltered(fuse.search(filter).map((result) => result.item));
	}, [filter]);
  
  function renderDeckCards() {
    if (filter !== "" && filtered.length > 0) {
      return filtered.map(deck => <DeckCard key={deck.id} deck={deck} />);
    } else {
      return decks.map(deck => <DeckCard key={deck.id} deck={deck} />);
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
				<div className={`dashboard-main-content-layout max-w-lg lg:max-w-3xl`}>
					<div className="flex flex-col w-full gap-4">
						<section className="flex w-full mt-2 justify-between items-center gap-2 px-2 max-w-md">
							<SearchBar
								value={filter}
								onChange={(e) => setFilter(e.target.value)}
								onClick={() => setFilter("")}
							/>

							<ButtonIcon>
								<div className="w-[2.5em] border border-surface-500 rounded p-1">
									<Sort />
								</div>
							</ButtonIcon>
							<ButtonIcon>
								<div className="w-[2.5em] border border-surface-500 rounded p-2">
									<Filter />
								</div>
							</ButtonIcon>
						</section>

						<section className="w-full flex flex-col gap-2">
							{ renderDeckCards() }
						</section>
					</div>
				</div>
			</DashboardMain>
		</DashboardLayout>
	);
}
