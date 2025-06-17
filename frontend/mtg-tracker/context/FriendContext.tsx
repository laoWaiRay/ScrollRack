"use client";

import { UserReadDTO } from "@/types/client";
import { createContext, ReactNode, useReducer, Reducer, Dispatch } from "react";

export enum ActionType {
	UPDATE,
}

type Action = { type: ActionType.UPDATE; payload: UserReadDTO[] };

interface FriendContextType {
	friends: UserReadDTO[];
	dispatch: Dispatch<Action>;
}

export const FriendContext = createContext<FriendContextType>({
	friends: [],
	dispatch: () => {
		throw new Error("dispatch must be used within a FriendProvider");
	},
});

interface FriendProviderInterface {
	children: ReactNode;
	initialFriends: UserReadDTO[];
}

export function FriendProvider({
	children,
	initialFriends,
}: FriendProviderInterface) {
	const [friends, dispatch] = useReducer(friendReducer, initialFriends);

	return (
		<FriendContext.Provider value={{ friends, dispatch }}>
			{children}
		</FriendContext.Provider>
	);
}

const friendReducer: Reducer<UserReadDTO[], Action> = (state, action) => {
	switch (action.type) {
		case ActionType.UPDATE: {
			return action.payload;
		}
	}
};
