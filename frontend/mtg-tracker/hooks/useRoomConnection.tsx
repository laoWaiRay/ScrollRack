import {
	HubConnection,
	HubConnectionBuilder,
	LogLevel,
} from "@microsoft/signalr";
import { UserReadDTO } from "@/types/client";
import { useEffect, useState } from "react";

export function useRoomConnection(
	roomCode: string | null,
	handleUpdatePlayers: (players: UserReadDTO[]) => void,
	handleCloseRoom: () => void,
	handleGameStart: () => void,
	handleGameEnd: () => void
) {
	const [connection, setConnection] = useState<HubConnection | null>(null);

	useEffect(() => {
    if (!roomCode) {
      console.log("No room code");
      return;
    }

		const conn = new HubConnectionBuilder()
			.withUrl("https://localhost:7165/hub", {
				logger: LogLevel.Information,
        withCredentials: true,
			})
			.withAutomaticReconnect()
			.build();

		setConnection(conn);
    
    conn.on("receiveUpdatePlayers", handleUpdatePlayers);
		conn.on("receiveCloseRoom", handleCloseRoom);
		conn.on("receiveGameStart", handleGameStart);
		conn.on("receiveGameEnd", handleGameEnd);
    
    async function start() {
      try {
        console.log("attempting to start")
        await conn.start(); 
        console.log("SignalR Connected");
        await conn.invoke("JoinRoomGroup", roomCode);
      } catch (err) {
        console.error(err);
      }
    }
    
    start();
    
    return () => {
      conn.stop();
    }
	}, [roomCode]);

	return { connection };
}
