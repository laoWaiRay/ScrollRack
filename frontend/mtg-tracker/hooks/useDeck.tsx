import { DeckContext } from "@/context/DeckContext";
import { useContext } from "react";

export function useDeck() {
  const context = useContext(DeckContext);
  
  if (context === undefined) {
    throw new Error("useDeck must be used inside a DeckProvider");
  }
  
  return context;
}