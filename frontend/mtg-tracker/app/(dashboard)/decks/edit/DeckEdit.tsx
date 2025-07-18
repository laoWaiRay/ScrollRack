"use client";
import { deleteDeck, editDeck } from "@/actions/decks";
import ButtonLink from "@/components/ButtonLink";
import ButtonPrimary from "@/components/ButtonPrimary";
import Dialog from "@/components/Dialog";
import ListBox from "@/components/ListBox";
import OptionsLayout from "@/components/OptionsLayout";
import TextInput from "@/components/TextInput";
import { extractAuthResult } from "@/helpers/extractAuthResult";
import { useAuth } from "@/hooks/useAuth";
import { useDeck } from "@/hooks/useDeck";
import { tryGetLocalStoragePlayerData } from "@/hooks/useLocalStorage";
import useToast from "@/hooks/useToast";
import { DeckReadDTO, DeckWriteDTO } from "@/types/client";
import { Field, Label } from "@headlessui/react";
import { FormEvent, useEffect, useState } from "react";

export default function DeckEdit() {
	const { user } = useAuth();
	const { toast } = useToast();
	const { decks, mutate } = useDeck();
	const [moxfield, setMoxfield] = useState<string>("");
	const [selected, setSelected] = useState<string | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

	const selectedDeck = decks.find((d) => d.commander === selected);

	async function handleUpdateDeck(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		try {
			if (!selectedDeck) {
				toast("Error updating deck", "warn");
				return;
			}

			if (
				moxfield !== "" &&
				!moxfield.startsWith("https://moxfield.com/decks")
			) {
				toast("Please provide a valid moxfield URL", "warn");
				return;
			}

			const deckWriteDTO: DeckWriteDTO = {
				commander: selectedDeck.commander,
				numGames: 0,
				numWins: 0,
				scryfallId: selectedDeck.scryfallId,
				userId: selectedDeck.userId,
				moxfield: moxfield,
			};

      setIsFetching(true);
      const authResult = await editDeck(deckWriteDTO, selectedDeck.id);
      extractAuthResult(authResult);
			mutate();

			setSelected(null);
			setMoxfield("");
			toast(`Updated deck "${selectedDeck.commander}"`, "success");
      setIsFetching(false);
		} catch (error) {
			console.log(error);
      setIsFetching(false);
			toast("Error updating deck", "warn");
		}
	}

	async function handleDeleteDeck() {
		if (!selectedDeck) {
			return;
		}

		try {
      const authResult = await deleteDeck(selectedDeck.id);
      extractAuthResult(authResult);
			mutate();

			if (user) {
				const localStorageData = tryGetLocalStoragePlayerData(user.id ?? "");
				let playerId: string | null = null;
				let playerDeckData: DeckReadDTO | null = null;
				if (localStorageData != null) {
					({ playerId, playerDeckData } = localStorageData);
				}
				if (playerId != null && playerDeckData != null) {
					if (playerDeckData.commander === selectedDeck.commander) {
						window.localStorage.removeItem(user.id);
					}
				}
			}

			setSelected(null);
			setMoxfield("");
			toast(`Deleted deck: ${selectedDeck.commander}`, "success");
		} catch (error) {
			console.log(error);
			toast("Error deleting deck", "warn");
		}
	}

	useEffect(() => {
		if (selected) {
			setMoxfield(selectedDeck?.moxfield ?? "");
		}
	}, [selected, selectedDeck?.moxfield]);

	return (
		<OptionsLayout title="Edit Decks">
			<Dialog
				title="Deleting Deck"
				description={`This action cannot be undone. Are you sure you want to delete "${selected}? All related game data will be erased.`}
				isDialogOpen={isDialogOpen}
				setIsDialogOpen={setIsDialogOpen}
				onConfirm={() => handleDeleteDeck()}
				useCountdown={true}
			/>

			<h2 className="mb-6 self-center uppercase">Edit Deck</h2>
			<form
				className="w-full flex flex-col gap-4"
				onSubmit={(e) => {
					handleUpdateDeck(e);
				}}
			>
				<Field>
					<Label className="block mb-1">Commander</Label>
					<ListBox
						list={decks.map((d) => d.commander)}
						selected={selected}
						setSelected={setSelected}
					/>
				</Field>
				<Field>
					<TextInput
						label="Moxfield Decklist (optional)"
						name="moxfield"
						value={moxfield}
						onChange={(e) => {
							setMoxfield(e.target.value);
						}}
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
						disabled={!selected || isFetching}
						uppercase={false}
					>
						Save Changes
					</ButtonPrimary>
				</section>
			</form>
			<section className="w-full flex justify-center mt-16 border-t border-surface-500 pt-4">
				<div className="self-center">
					<ButtonPrimary
						style="danger"
						onClick={() => setIsDialogOpen(true)}
						disabled={!selected}
					>
						Delete Deck
					</ButtonPrimary>
				</div>
			</section>
		</OptionsLayout>
	);
}
