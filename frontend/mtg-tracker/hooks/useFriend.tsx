import { FriendContext } from "@/context/FriendContext";
import { useContext } from "react";

export function useFriend() {
  const context = useContext(FriendContext);
  
  if (context === undefined) {
    throw new Error("useFriend must be used inside an AuthProvider");
  }
  
  return context;
}