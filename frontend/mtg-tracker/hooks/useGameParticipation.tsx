import { GameParticipationContext } from "@/context/GameParticipationContext"
import { useContext } from "react";

export function useGameParticipation() {
  const context = useContext(GameParticipationContext);
  
  if (context === undefined) {
    throw new Error("useGameParticipation must be used inside a GameParticipationProvider");
  }
  
  return context;
}