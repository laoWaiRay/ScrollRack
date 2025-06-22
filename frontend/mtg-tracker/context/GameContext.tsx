"use client";

import { GameReadDTO } from "@/types/client";
import { createContext, ReactNode, useReducer, Reducer, Dispatch } from "react";

export enum ActionType {
	UPDATE,
}

type Action = { type: ActionType.UPDATE; payload: GameReadDTO[] };

interface GameContextType {
	games: GameReadDTO[];
	dispatch: Dispatch<Action>;
}

export const GameContext = createContext<GameContextType>({
	games: [],
	dispatch: () => {
		throw new Error("dispatch must be used within a GameProvider");
	},
});

interface GameProviderInterface {
	children: ReactNode;
	initialGames: GameReadDTO[];
}

export function GameProvider({
	children,
	initialGames,
}: GameProviderInterface) {
	const [games, dispatch] = useReducer(gameReducer, initialGames);

	return (
		<GameContext.Provider value={{ games, dispatch }}>
			{children}
		</GameContext.Provider>
	);
}

const gameReducer: Reducer<GameReadDTO[], Action> = (state, action) => {
	switch (action.type) {
		case ActionType.UPDATE: {
			return action.payload;
		}
	}
};
