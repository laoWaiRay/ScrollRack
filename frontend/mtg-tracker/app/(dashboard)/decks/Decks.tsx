"use client";
import ButtonLink from "@/components/ButtonLink";
import {
	DashboardLayout,
	DashboardHeader,
	DashboardMain,
} from "@/components/Dashboard";
import { useAuth } from "@/hooks/useAuth";
import Add from "@/public/icons/add.svg";
import Edit from "@/public/icons/edit.svg";
import { useDeck } from "@/hooks/useDeck";
import DeckDisplay from "@/components/DeckDisplay";

export default function Decks() {
	const { user } = useAuth();
	const { decks, isLoading } = useDeck();

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
				<DeckDisplay decks={decks} isLoading={isLoading} />
			</DashboardMain>
		</DashboardLayout>
	);
}
