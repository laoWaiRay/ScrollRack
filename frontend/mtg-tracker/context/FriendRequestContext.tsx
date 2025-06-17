"use client";

import { UserReadDTO } from "@/types/client";
import { createContext, ReactNode, useReducer, Reducer, Dispatch } from "react";

export enum ActionType {
	UPDATE,
}

type Action = { type: ActionType.UPDATE; payload: UserReadDTO[] };

interface FriendRequestContextType {
	friendRequests: UserReadDTO[];
	dispatch: Dispatch<Action>;
}

export const FriendRequestContext = createContext<FriendRequestContextType>({
	friendRequests: [],
	dispatch: () => {
    throw new Error("dispatch must be used within a FriendRequestProvider");
  },
});

interface FriendRequestProviderInterface {
	children: ReactNode;
	initialFriendRequests: UserReadDTO[];
}

export function FriendRequestProvider({
	children,
	initialFriendRequests,
}: FriendRequestProviderInterface) {
	const [friendRequests, dispatch] = useReducer(
		friendRequestReducer,
		initialFriendRequests
	);

	return (
		<FriendRequestContext.Provider value={{ friendRequests, dispatch }}>
			{children}
		</FriendRequestContext.Provider>
	);
}

const friendRequestReducer: Reducer<UserReadDTO[], Action> = (
	state,
	action
) => {
	switch (action.type) {
		case ActionType.UPDATE: {
			return action.payload;
		}
	}
};
