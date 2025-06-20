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
import Image from "next/image";
import { useState } from "react";
import Sort from "@/public/icons/sort.svg";

interface DecksInterface {
	decks: DeckReadDTO[] | null;
}

function getImageUrl(scryfallId: string) {
	return `https://cards.scryfall.io/normal/front/${scryfallId[0]}/${scryfallId[1]}/${scryfallId}.jpg`;
}

export default function Decks({ decks }: DecksInterface) {
	const { user } = useAuth();
	const [filter, setFilter] = useState("");

	return (
		<DashboardLayout>
			<DashboardHeader title="Decks" user={user}></DashboardHeader>
			<DashboardMain>
				<div className={`dashboard-main-content-layout gap-8 !max-w-lg`}>
					<div className="flex flex-col w-full gap-2">
						<section className="flex w-full justify-end items-center px-2">
							<div className="flex gap-4">
								<ButtonLink
									href="/decks/edit"
									style="transparent"
									styles="border border-surface-500"
									uppercase={false}
								>
									Edit Decks
								</ButtonLink>
								<ButtonLink href="/decks/add" uppercase={false}>
									Add Decks
								</ButtonLink>
							</div>
						</section>
						<section className="flex w-full mt-2 justify-between items-center gap-4 px-2">
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
						</section>
					</div>
					<section>{JSON.stringify(decks, null, 3)}</section>
					<section>
						{decks && decks.length > 0 && getImageUrl(decks[0]?.scryfallId)}
					</section>
					<section className="w-[75%] aspect-[5/7] relative rounded-3xl overflow-hidden">
						<Image
							src={
								decks && decks.length > 0
									? getImageUrl(decks[0]?.scryfallId)
									: ""
							}
							fill={true}
							alt="card art"
						/>
					</section>
				</div>
			</DashboardMain>
		</DashboardLayout>
	);
}
