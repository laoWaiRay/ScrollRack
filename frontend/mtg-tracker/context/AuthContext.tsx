"use client"

import {
	createContext,
	ReactNode,
	useReducer,
	Reducer,
	Dispatch,
} from "react";
import { schemas } from "@/generated/client";
import { z } from "zod";

type UserReadDTO = z.infer<typeof schemas.UserReadDTO>;

export enum ActionType {
	LOGIN,
	LOGOUT,
}

type Action =
	| { type: ActionType.LOGIN; payload: UserReadDTO }
	| { type: ActionType.LOGOUT };

interface AuthContextType {
	user: UserReadDTO | null;
  dispatch: Dispatch<Action> | undefined;
}

export const AuthContext = createContext<AuthContextType>({ user: null, dispatch: undefined });

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
	}
};
