import { FriendRequestContext } from "@/context/FriendRequestContext";
import { useContext } from "react";

export function useFriendRequest() {
  const context = useContext(FriendRequestContext);
  
  if (context === undefined) {
    throw new Error("useFriendRequest must be used inside an AuthProvider");
  }
  
  return context;
}