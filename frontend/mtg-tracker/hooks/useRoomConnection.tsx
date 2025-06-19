import {
	HubConnection,
	HubConnectionBuilder,
	HubConnectionState,
	LogLevel,
} from "@microsoft/signalr";
import { RoomDTO } from "@/types/client";
import { useEffect, useRef } from "react";

export function useRoomConnection(
	roomCode: string | null,
	handleReceiveUpdateRoom: (players: RoomDTO) => void,
	handleReceivePlayerJoin: (conn: HubConnection | null) => void,
	handleReceivePlayerLeave: (conn: HubConnection | null) => void,
	handleReceivePlayerAdd: () => void,
	handleReceivePlayerRemove: () => void,
	handleReceiveCloseRoom: () => void,
	handleReceiveGameStart: () => void,
	handleReceiveGameEnd: () => void
) {
	const connectionRef = useRef<HubConnection | null>(null);

	useEffect(() => {
		const conn = new HubConnectionBuilder()
			.withUrl("https://localhost:7165/hub", {
				logger: LogLevel.Information,
				withCredentials: true,
			})
			.withAutomaticReconnect()
			.build();

		// Register handlers
		conn.on("receiveUpdateRoom", (room: RoomDTO) => {
			handleReceiveUpdateRoom(room);
		});

		conn.on("receivePlayerJoin", () => {
			handleReceivePlayerJoin(connectionRef.current);
		});

		conn.on("receivePlayerLeave", () => {
			handleReceivePlayerLeave(connectionRef.current);
		});

		conn.on("receivePlayerAdd", () => {
			handleReceivePlayerAdd();
		});

		conn.on("receivePlayerRemove", () => {
			handleReceivePlayerRemove();
		});

		conn.on("receiveCloseRoom", () => {
			handleReceiveCloseRoom();
		});

		conn.on("receiveGameStart", () => {
			handleReceiveGameStart();
		});

		conn.on("receiveGameEnd", () => {
			handleReceiveGameEnd();
		});

		async function start() {
			try {
				await conn.start();
				connectionRef.current = conn;

        // If the user is in a room, add them to the SignalR group
				if (roomCode) {
					await conn.invoke("playerJoin", roomCode);
				}
			} catch (err) {
				console.error(err);
			}
		}

		start();

		return () => {
			async function stop() {
				const { current: connection } = connectionRef;
				if (
					connection &&
					connection.state !== HubConnectionState.Disconnected
				) {
					// if (roomCode) {
					// 	await connection.invoke("playerLeave", roomCode);
					// }

					await connection.stop();
				}
			}
			stop();
		};
	}, [roomCode]);

	return { connectionRef };
}
