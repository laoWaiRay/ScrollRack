"use client";

import { DeckReadDTO } from "@/types/client";
import { createContext, ReactNode, useReducer, Reducer, Dispatch } from "react";

export enum ActionType {
	UPDATE,
}

type Action = { type: ActionType.UPDATE; payload: DeckReadDTO[] };

interface DeckContextType {
	decks: DeckReadDTO[];
	dispatch: Dispatch<Action>;
}

export const DeckContext = createContext<DeckContextType>({
	decks: [],
	dispatch: () => {
		throw new Error("dispatch must be used within a DeckProvider");
	},
});

interface DeckProviderInterface {
	children: ReactNode;
	initialDecks: DeckReadDTO[];
}

export function DeckProvider({
	children,
	initialDecks,
}: DeckProviderInterface) {
	const [decks, dispatch] = useReducer(deckReducer, initialDecks);

	return (
		<DeckContext.Provider value={{ decks, dispatch }}>
			{children}
		</DeckContext.Provider>
	);
}

const deckReducer: Reducer<DeckReadDTO[], Action> = (state, action) => {
	switch (action.type) {
		case ActionType.UPDATE: {
			return action.payload;
		}
	}
};
