"use client";

import { GameReadDTO } from "@/types/client";
import { createContext, ReactNode, useReducer, Reducer, Dispatch } from "react";

export enum ActionType {
	UPDATE,
  APPEND,
  SET_PAGE,
  SET_HAS_MORE,
}

export interface GameState {
	games: GameReadDTO[];
	page: number;
	hasMore: boolean;
}

type Action =
  | { type: ActionType.UPDATE; payload: GameReadDTO[] }
  | { type: ActionType.APPEND; payload: GameReadDTO[] }
  | { type: ActionType.SET_PAGE; payload: number }
  | { type: ActionType.SET_HAS_MORE; payload: boolean };

interface GameContextType {
	gameState: GameState;
	dispatch: Dispatch<Action>;
}

export const GameContext = createContext<GameContextType>({
	gameState: { games: [], page: 0, hasMore: true },
	dispatch: () => {
		throw new Error("dispatch must be used within a GameProvider");
	},
});

interface GameProviderInterface {
	children: ReactNode;
	initialGameState: GameState;
}

export function GameProvider({
	children,
	initialGameState,
}: GameProviderInterface) {
	const [gameState, dispatch] = useReducer(gameReducer, initialGameState);

	return (
		<GameContext.Provider value={{ gameState, dispatch }}>
			{children}
		</GameContext.Provider>
	);
}

const gameReducer: Reducer<GameState, Action> = (state, action) => {
	switch (action.type) {
		case ActionType.UPDATE: {
			return { ...state, games: action.payload };
		}
    case ActionType.APPEND: {
      return { ...state, games: [ ...state.games, ...action.payload ] };
    }
    case ActionType.SET_PAGE: {
      return { ...state, page: action.payload } 
    }
    case ActionType.SET_HAS_MORE: {
      return { ...state, hasMore: action.payload } 
    }
	}
};
