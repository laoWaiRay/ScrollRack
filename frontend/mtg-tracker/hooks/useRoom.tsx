import { RoomContext } from "@/context/RoomContext";
import { useContext } from "react";

export function useRoom() {
  const context = useContext(RoomContext);
  
  if (context === undefined) {
    throw new Error("useRoom must be used inside a RoomProvider");
  }
  
  return context;
}