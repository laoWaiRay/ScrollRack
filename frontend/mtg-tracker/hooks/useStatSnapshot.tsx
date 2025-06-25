import { SnapshotContext } from "@/context/StatSnapshotContext";
import { useContext } from "react";

export function useStatSnapshot() {
  const context = useContext(SnapshotContext);
  
  if (context === undefined) {
    throw new Error("useStatSnapshot must be used inside a SnapshotProvider");
  }
  
  return context;
}