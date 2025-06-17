"use client"

import { UserReadDTO } from "@/types/client";
import {
	createContext,
	ReactNode,
	useReducer,
	Reducer,
	Dispatch,
} from "react";

export enum ActionType {
	LOGIN,
	LOGOUT,
  UPDATE,
}

type Action =
	| { type: ActionType.LOGIN; payload: UserReadDTO }
	| { type: ActionType.LOGOUT }
	| { type: ActionType.UPDATE; payload: UserReadDTO };

interface AuthContextType {
	user: UserReadDTO | null;
  dispatch: Dispatch<Action>;
}

export const AuthContext = createContext<AuthContextType>({ user: null, dispatch: () => {
    throw new Error("dispatch must be used within an AuthProvider");
} });

export function AuthProvider({ children, initialUser }: { children: ReactNode, initialUser: UserReadDTO | null }) {
	const [user, dispatch] = useReducer(authReducer, initialUser);
  
  return (
	<AuthContext.Provider value={{ user, dispatch }}>
	  { children }
	</AuthContext.Provider>
  );
}

const authReducer: Reducer<UserReadDTO | null, Action> = (state, action) => {
	switch (action.type) {
		case ActionType.LOGIN: {
			return action.payload;
		}
		case ActionType.LOGOUT: {
			return null;
		}
    case ActionType.UPDATE: {
      return action.payload; 
    }
	}
};
