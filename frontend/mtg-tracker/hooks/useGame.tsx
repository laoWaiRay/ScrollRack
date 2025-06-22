import { GameContext } from "@/context/GameContext";
import { useContext } from "react";

export function useGame() {
  const context = useContext(GameContext);
  
  if (context === undefined) {
    throw new Error("useGame must be used inside a GameProvider");
  }
  
  return context;
}