"use server";

import { getStatSnapshot } from "@/actions/statSnapshots";
import CommandZone from "./CommandZone";
import { getDecks } from "@/actions/decks";

export default async function page() {
  const statSnapshot = await getStatSnapshot();
  const decks = await getDecks();

  return (
    <CommandZone statSnapshot={statSnapshot} decks={decks} />
  )
}
