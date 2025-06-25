"use client";

import { StatSnapshotDTO } from "@/types/client";
import { createContext, ReactNode, useReducer, Reducer, Dispatch } from "react";

export enum ActionType {
	UPDATE,
}

type Action = { type: ActionType.UPDATE; payload: StatSnapshotDTO };

interface SnapshotContextType {
	snapshot: StatSnapshotDTO;
	dispatch: Dispatch<Action>;
}

export const defaultStatSnapshot: StatSnapshotDTO = {
	gamesPlayed: 0,
	gamesWon: 0,
	numDecks: 0,
	currentWinStreak: 0,
	currentLossStreak: 0,
	longestWinStreak: 0,
	longestLossStreak: 0,
	createdAt: undefined,
};

export const SnapshotContext = createContext<SnapshotContextType>({
	snapshot: defaultStatSnapshot,
	dispatch: () => {
		throw new Error("dispatch must be used within a SnapshotProvider");
	},
});

interface SnapshotProviderInterface {
	children: ReactNode;
	initialSnapshot: StatSnapshotDTO;
}

export function SnapshotProvider({
	children,
	initialSnapshot,
}: SnapshotProviderInterface) {
	const [snapshot, dispatch] = useReducer(snapshotReducer, initialSnapshot);

	return (
		<SnapshotContext.Provider value={{ snapshot, dispatch }}>
			{children}
		</SnapshotContext.Provider>
	);
}

const snapshotReducer: Reducer<StatSnapshotDTO, Action> = (state, action) => {
	switch (action.type) {
		case ActionType.UPDATE: {
			return action.payload;
		}
	}
};
