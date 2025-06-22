"use client";

import { GameParticipationReadDTO } from "@/types/client";
import { createContext, ReactNode, useReducer, Reducer, Dispatch } from "react";

export enum ActionType {
  UPDATE,
}

type Action = { type: ActionType.UPDATE; payload: GameParticipationReadDTO[] };

interface GameParticipationContextType {
  gameParticipations: GameParticipationReadDTO[];
  dispatch: Dispatch<Action>;
}

export const GameParticipationContext = createContext<GameParticipationContextType>({
  gameParticipations: [],
  dispatch: () => {
    throw new Error("dispatch must be used within a GameParticipationProvider");
  },
});

interface GameParticipationProviderInterface {
  children: ReactNode;
  initialGameParticipations: GameParticipationReadDTO[];
}

export function GameParticipationProvider({
  children,
  initialGameParticipations,
}: GameParticipationProviderInterface) {
  const [gameParticipations, dispatch] = useReducer(gameParticipationReducer, initialGameParticipations);

  return (
    <GameParticipationContext.Provider value={{ gameParticipations, dispatch }}>
      {children}
    </GameParticipationContext.Provider>
  );
}

const gameParticipationReducer: Reducer<GameParticipationReadDTO[], Action> = (state, action) => {
  switch (action.type) {
    case ActionType.UPDATE: {
      return action.payload;
    }
  }
};
