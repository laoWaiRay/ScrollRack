"use client";
import { createDeck } from "@/actions/decks";
import ButtonLink from "@/components/ButtonLink";
import ButtonPrimary from "@/components/ButtonPrimary";
import ComboBox from "@/components/ComboBox";
import OptionsLayout from "@/components/OptionsLayout";
import TextInput from "@/components/TextInput";
import { CONFLICT, NOT_FOUND } from "@/constants/httpStatus";
import { extractAuthResult } from "@/helpers/extractAuthResult";
import { useAuth } from "@/hooks/useAuth";
import useToast from "@/hooks/useToast";
import { DeckWriteDTO } from "@/types/client";
import { Field, Label } from "@headlessui/react";
import { isAxiosError } from "axios";
import {
	Dispatch,
	FormEvent,
	SetStateAction,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";

interface ScryfallCardData {
	id: string;
	name: string;
}

export default function DeckAdd() {
	const { user } = useAuth();
	const [cards, setCards] = useState<ScryfallCardData[]>([]);
	const [selectedCard, setSelectedCard] = useState<ScryfallCardData | null>(
		null
	);
	const [selected, setSelected] = useState<string | null>(null);
	const [query, setQuery] = useState("");
	const [moxfield, setMoxfield] = useState("");
	const delayRef = useRef(false);
	const { toast } = useToast();

	const handleComboboxSelect: Dispatch<SetStateAction<string | null>> = (
		value
	) => {
		setSelected(value);
		setSelectedCard(cards.find((c) => c.name === value) ?? null);
	};

	const callScryfall = useCallback(async () => {
		// Insert artificial delay between API calls to respect rate limits requested by Scryfall:
		// https://scryfall.com/docs/api
		if (delayRef.current) {
			return;
		}
		delayRef.current = true;
		await new Promise((resolve) => setTimeout(resolve, 250));
		delayRef.current = false;

		const cardName = query.replaceAll(/[^a-zA-Z0-9,-\s]/g, "");
		const filteredSearchString = `${cardName} type:legendary (game:paper)`;
		try {
			const response = await fetch(
				`https://api.scryfall.com/cards/search?q=${filteredSearchString}`
			);

			if (response.status === NOT_FOUND) {
				console.log("Card not found");
				return;
			}

			const json = await response.json();
			console.log("Called API");

			if ("object" in json) {
				if (json["object"] == "list") {
					if ("data" in json) {
						const scryfallCardData = json["data"]
							.map((card: any): ScryfallCardData | null => {
								if ("name" in card) {
									return { name: card["name"], id: card["id"] };
								} else {
									return null;
								}
							})
							.filter((card: any) => card !== null);
						setCards(scryfallCardData);
					}
				}
			} else {
				console.log("Invalid json");
				setCards([]);
			}
		} catch (error) {
			console.log(`Fetch Error: ${error}`);
		}
	}, [query]);

	async function handleAddDeck(e: FormEvent<HTMLElement>) {
		e.preventDefault();
		if (
			!selected ||
			!selectedCard ||
			!cards.find((card) => card.name === selected)
		) {
			return;
		}

		if (!user) {
			return;
		}

		if (moxfield !== "" && !moxfield.startsWith("https://moxfield.com/decks")) {
			toast("Please provide a valid moxfield URL", "warn");
			return;
		}

		const deckWriteDTO: DeckWriteDTO = {
			commander: selected,
			scryfallId: selectedCard.id,
			userId: user?.id,
			moxfield: moxfield,
			numGames: 0,
			numWins: 0,
		};

		try {
			const authResult = await createDeck(deckWriteDTO);
      extractAuthResult(authResult);
      setSelected(null);
      setQuery("");
      setMoxfield("");
      toast(`Saved deck: ${selected}`, "success");
		} catch (error) {
			if (isAxiosError(error) && error.response?.status === CONFLICT) {
				toast(`Deck with commander ${selected} already exists`, "warn");
			} else {
				console.log(error);
				toast("Error saving deck", "warn");
			}
		}
	}

	useEffect(() => {
		if (query.length <= 2) return;

		// Debounce input to avoid spamming the api
		const handle = setTimeout(() => {
			callScryfall();
		}, 300);

		return () => clearTimeout(handle);
	}, [query, callScryfall]);

	return (
		<OptionsLayout title="Add Decks">
			<h2 className="mb-6 self-center uppercase">Add Deck</h2>
			<form
				className="w-full flex flex-col gap-4"
				onSubmit={(e) => handleAddDeck(e)}
			>
				<Field>
					<Label className="block mb-1">Commander</Label>
					<ComboBox
						list={cards.map((card) => card.name)}
						query={query}
						setQuery={setQuery}
						selected={selected}
						setSelected={handleComboboxSelect}
					/>
				</Field>
				<Field>
					<TextInput
						label="Moxfield Decklist (optional)"
						name="moxfield"
						value={moxfield}
						onChange={(e) => setMoxfield(e.target.value)}
						placeholder="https://moxfield.com/decks/..."
						isDisabled={!selected}
					></TextInput>
				</Field>
				<section className="flex flex-col w-full justify-center items-center gap-4">
					<ButtonLink
						href="/decks"
						style="transparent"
						styles="border border-surface-500 py-4 w-full text-center -mb-4"
						uppercase={false}
					>
						Back to Decks
					</ButtonLink>

					<ButtonPrimary
						type="submit"
						style="primary"
						onClick={() => {}}
						disabled={!selected}
						uppercase={false}
					>
						Save Deck
					</ButtonPrimary>
				</section>
			</form>
		</OptionsLayout>
	);
}
