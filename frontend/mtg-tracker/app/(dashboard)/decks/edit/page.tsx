"use server";

import { getDecks } from "@/actions/decks";
import DeckEdit from "./DeckEdit";

export default async function page() {
  const decks = await getDecks();

  return (
    <DeckEdit initialDecks={decks} />
  )
}