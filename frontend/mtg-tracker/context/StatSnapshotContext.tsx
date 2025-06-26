"use client";

import { StatSnapshotDTO, StatSnapshotsByPeriodDTO } from "@/types/client";
import { createContext, ReactNode, useReducer, Reducer, Dispatch } from "react";

export enum ActionType {
	UPDATE,
}

type Action = { type: ActionType.UPDATE; payload: StatSnapshotsByPeriodDTO };

interface SnapshotContextType {
	snapshots: StatSnapshotsByPeriodDTO;
	dispatch: Dispatch<Action>;
}

const defaultStatSnapshot: StatSnapshotDTO = {
  gamesPlayed: 0,
  gamesWon: 0,
  numDecks: 0,
  currentWinStreak: 0,
  longestWinStreak: 0,
  longestLossStreak: 0,
  createdAt: undefined,
  mostPlayedCommanders: [],
  leastPlayedCommanders: [],
};

export const defaultStatSnapshots: StatSnapshotsByPeriodDTO = {
  allTime: defaultStatSnapshot,
  currentYear: defaultStatSnapshot,
  currentMonth: defaultStatSnapshot,
};

export const SnapshotContext = createContext<SnapshotContextType>({
	snapshots: defaultStatSnapshots,
	dispatch: () => {
		throw new Error("dispatch must be used within a SnapshotProvider");
	},
});

interface SnapshotProviderInterface {
	children: ReactNode;
	initialSnapshots: StatSnapshotsByPeriodDTO;
}

export function SnapshotProvider({
	children,
	initialSnapshots,
}: SnapshotProviderInterface) {
	const [snapshots, dispatch] = useReducer(snapshotReducer, initialSnapshots);

	return (
		<SnapshotContext.Provider value={{ snapshots, dispatch }}>
			{children}
		</SnapshotContext.Provider>
	);
}

const snapshotReducer: Reducer<StatSnapshotsByPeriodDTO, Action> = (state, action) => {
	switch (action.type) {
		case ActionType.UPDATE: {
			return action.payload;
		}
	}
};
