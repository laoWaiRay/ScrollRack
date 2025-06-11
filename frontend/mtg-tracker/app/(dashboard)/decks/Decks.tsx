"use client"
import {
	DashboardLayout,
	DashboardHeader,
	DashboardMain,
} from "@/components/Dashboard";
import { useAuth } from "@/hooks/useAuth";
import { DeckReadDTO } from "@/types/client";

interface DecksInterface {
	decks: DeckReadDTO[] | null;
}

export default function Decks({ decks }: DecksInterface) {
  const { user } = useAuth();

	return (<DashboardLayout>
    <DashboardHeader title="Decks" user={user}></DashboardHeader>
    <DashboardMain>
      {JSON.stringify(decks, null, 3)}
    </DashboardMain>
  </DashboardLayout>);
}
