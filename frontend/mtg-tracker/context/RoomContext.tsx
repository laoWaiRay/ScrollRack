"use client";

import { RoomDTO } from "@/types/client";
import { createContext, ReactNode, useReducer, Reducer, Dispatch } from "react";

export enum ActionType {
	UPDATE,
}

type Action = { type: ActionType.UPDATE; payload: RoomDTO[] };

interface RoomContextType {
	rooms: RoomDTO[];
	dispatch: Dispatch<Action>;
}

export const RoomContext = createContext<RoomContextType>({
	rooms: [],
	dispatch: () => {
		throw new Error("dispatch must be used within a RoomProvider");
	},
});

interface RoomProviderInterface {
	children: ReactNode;
	initialRooms: RoomDTO[];
}

export function RoomProvider({
	children,
	initialRooms,
}: RoomProviderInterface) {
	const [rooms, dispatch] = useReducer(roomReducer, initialRooms);

	return (
		<RoomContext.Provider value={{ rooms, dispatch }}>
			{children}
		</RoomContext.Provider>
	);
}

const roomReducer: Reducer<RoomDTO[], Action> = (state, action) => {
	switch (action.type) {
		case ActionType.UPDATE: {
			return action.payload;
		}
	}
};
