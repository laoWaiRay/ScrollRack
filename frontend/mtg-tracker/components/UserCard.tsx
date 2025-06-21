"use client";
import { DeckReadDTO, UserReadDTO } from "@/types/client";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ListBox from "./ListBox";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { UserDeckData } from "@/app/(dashboard)/pod/create/CreatePod";
import { getImageUrl } from "@/helpers/scryfallApi";

const defaultBgImage = "/images/Wallpaper_Vivi_Ornitier_2560x1600.png";

interface UserCardInterface {
	user: UserReadDTO;
	styles?: string;
	textColor?: string;
	useDeckSelector?: boolean;
	playerIdToDeck?: Record<string, DeckReadDTO | null>;
	setPlayerIdToDeck?: Dispatch<
		SetStateAction<Record<string, DeckReadDTO | null>>
	>;
	useCommanderDisplay?: boolean;
}

export default function UserCard({
	user,
	styles,
	textColor = "",
	useDeckSelector = false,
	playerIdToDeck,
	setPlayerIdToDeck,
	useCommanderDisplay = false,
}: UserCardInterface) {
	const [selected, setSelected] = useState<string | null>(null);
	const [localStorageValue, setLocalStorageValue] =
		useLocalStorage<UserDeckData>(user.id);

	const userDeck = user.decks.find((d) => d.commander === selected);

	const handleSelect: Dispatch<SetStateAction<string | null>> = (value) => {
		if (!setPlayerIdToDeck || !playerIdToDeck) {
			throw Error(
				"Must provide playerIdToDeck and setPlayerIdToDeck callback function"
			);
		}

		if (!user) {
			console.log("No user found for user card");
			return;
		}

		const selectedValue = typeof value === "function" ? value(selected) : value;
		const deckReadDTO = user.decks.find((d) => d.commander === selectedValue);

		if (!deckReadDTO) {
			console.log("Deck not found");
			return;
		}

		setSelected(selectedValue);
		setPlayerIdToDeck({ ...playerIdToDeck, [user.id]: deckReadDTO });
		setLocalStorageValue({ id: user.id, deckData: deckReadDTO });
	};

	useEffect(() => {
		if (selected) {
			return;
		}

		const selectedDeckData = localStorageValue;
		if (selectedDeckData) {
			setSelected(selectedDeckData.deckData.commander);

			if (setPlayerIdToDeck) {
				setPlayerIdToDeck({
					...playerIdToDeck,
					[user.id]: selectedDeckData.deckData,
				});
			}
		}
	}, []);

	return (
		<div className="flex flex-col gap-3 w-full text-white px-4 py-16 relative">
			<Image
				className="h-full w-full object-cover z-0"
				src={
					userDeck
						? getImageUrl(userDeck.scryfallId, "art_crop")
						: defaultBgImage
				}
				alt="User avatar"
				fill={true}
			/>
			<div className="absolute inset-0 bg-black/80 z-0" />

			<div className={`flex gap-2 items-center z-10 ${styles}`}>
				<div className="w-[2em] h-[2em] rounded-full overflow-hidden">
					<Image
						className="h-full w-full object-cover"
						src={`${user?.profile ?? "/images/fblthp.jpeg"}`}
						height={64}
						width={64}
						alt="User avatar"
					/>
				</div>
				<span className={`font-semibold ${textColor}`}>{user?.userName}</span>
			</div>

			{useDeckSelector && (
				<ListBox
					list={user.decks.map((d) => d.commander)}
					selected={selected}
					setSelected={handleSelect}
          transparent={true}
				/>
			)}

			{useCommanderDisplay && (
				<div className={`z-10 self-start ${textColor}`}>{userDeck?.commander}</div>
			)}
		</div>
	);
}
