"use server";

import { getDecks } from "@/actions/decks";
import Decks from "./Decks";

export default async function page() {
  const decks = await getDecks();

  return (
    <Decks decks={decks} />
  )
}