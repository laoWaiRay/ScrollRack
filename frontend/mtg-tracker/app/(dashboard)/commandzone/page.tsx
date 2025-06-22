"use server";

import { getStatSnapshot } from "@/actions/statSnapshots";
import CommandZone from "./CommandZone";

export default async function page() {
  const statSnapshot = await getStatSnapshot();

  return (
    <CommandZone statSnapshot={statSnapshot} />
  )
}
