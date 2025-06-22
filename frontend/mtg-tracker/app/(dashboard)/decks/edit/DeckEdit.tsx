"use client";
import { getDecks } from "@/actions/decks";
import ButtonLink from "@/components/ButtonLink";
import ButtonPrimary from "@/components/ButtonPrimary";
import Dialog from "@/components/Dialog";
import ListBox from "@/components/ListBox";
import OptionsLayout from "@/components/OptionsLayout";
import TextInput from "@/components/TextInput";
import { ActionType } from "@/context/DeckContext";
import { api } from "@/generated/client";
import { useAuth } from "@/hooks/useAuth";
import { useDeck } from "@/hooks/useDeck";
import useToast from "@/hooks/useToast";
import { DeckWriteDTO } from "@/types/client";
import { Field, Label } from "@headlessui/react";
import { FormEvent, useEffect, useState } from "react";

interface DeckEditInterface {}

export default function DeckEdit({}: DeckEditInterface) {
	const { user } = useAuth();
	const { toast } = useToast();
	const { decks, dispatch } = useDeck();
	const [moxfield, setMoxfield] = useState<string>("");
	const [selected, setSelected] = useState<string | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

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
				...selectedDeck,
				moxfield: moxfield,
			};

			await api.putApiDeckId(deckWriteDTO, {
				params: { id: selectedDeck.id },
				withCredentials: true,
			});
			setSelected(null);
			setMoxfield("");
			dispatch({
				type: ActionType.UPDATE,
				payload: [
					...decks.filter((d) => d.id !== selectedDeck.id),
					{ ...selectedDeck, moxfield },
				],
			});

			toast(`Updated deck "${selectedDeck.commander}"`, "success");
		} catch (error) {
			console.log(error);
			toast("Error updating deck", "warn");
		}
	}

	async function handleDeleteDeck() {
		if (!selectedDeck) {
			return;
		}

		try {
			await api.deleteApiDeckId(undefined, {
				params: { id: selectedDeck.id },
				withCredentials: true,
			});
			const updatedDecks = decks.filter(d => d.id !== selectedDeck.id);
			dispatch({ type: ActionType.UPDATE, payload: updatedDecks });

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
	}, [selected]);

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
				<section className="flex w-full justify-center items-center gap-4 -mt-4">
					<ButtonLink
						href="/decks"
						style="transparent"
						styles="border border-surface-500 py-4"
						uppercase={false}
					>
						View Decks
					</ButtonLink>
					<div>
						<ButtonPrimary
							type="submit"
							style="primary"
							onClick={() => {}}
							disabled={!selected}
							uppercase={false}
						>
							Save Changes
						</ButtonPrimary>
					</div>
				</section>
			</form>
			<section className="w-full flex justify-center mt-32 border-t border-surface-500 pt-4">
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
