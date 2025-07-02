import {
	HubConnection,
	HubConnectionBuilder,
	HubConnectionState,
	LogLevel,
} from "@microsoft/signalr";
import { RoomDTO } from "@/types/client";
import { useEffect, useRef } from "react";
import { getAccessToken } from "@/actions/helpers/auth";

export interface RoomConnectionHandlers {
	handleReceiveUpdateRoom?: (players: RoomDTO) => void;
	handleReceivePlayerJoin?: (conn: HubConnection | null) => void;
	handleReceivePlayerLeave?: (conn: HubConnection | null) => void;
	handleReceivePlayerAdd?: () => void;
	handleReceivePlayerRemove?: () => void;
	handleReceiveCloseRoom?: () => void;
	handleReceiveGameStart?: () => void;
	handleReceiveGameEnd?: () => void;
}

export function useRoomConnection(
	roomCode: string | null,
	handlers: RoomConnectionHandlers
) {
	const connectionRef = useRef<HubConnection | null>(null);

	useEffect(() => {
		const conn = new HubConnectionBuilder()
			.withUrl("https://localhost:7165/hub", {
				logger: LogLevel.Information,
        accessTokenFactory: getAccessToken
			})
			.withAutomaticReconnect()
			.build();

		const {
			handleReceiveUpdateRoom,
			handleReceivePlayerJoin,
			handleReceivePlayerLeave,
			handleReceivePlayerAdd,
			handleReceivePlayerRemove,
			handleReceiveCloseRoom,
			handleReceiveGameStart,
			handleReceiveGameEnd,
		} = handlers;

		if (handleReceiveUpdateRoom) {
			conn.on("receiveUpdateRoom", (room: RoomDTO) => {
				handleReceiveUpdateRoom?.(room);
			});
		}
		if (handleReceivePlayerJoin) {
			conn.on("receivePlayerJoin", () => {
				if (
					connectionRef.current &&
					connectionRef.current.state === HubConnectionState.Connected
				) {
					handleReceivePlayerJoin(connectionRef.current);
				}
			});
		}
		if (handleReceivePlayerLeave) {
			conn.on("receivePlayerLeave", () => {
				if (
					connectionRef.current &&
					connectionRef.current.state === HubConnectionState.Connected
				) {
					handleReceivePlayerLeave(connectionRef.current);
				}
			});
		}
		if (handleReceivePlayerAdd) {
			conn.on("receivePlayerAdd", () => {
				handleReceivePlayerAdd();
			});
		}
		if (handleReceivePlayerRemove) {
			conn.on("receivePlayerRemove", () => {
				handleReceivePlayerRemove();
			});
		}
		if (handleReceiveCloseRoom) {
			conn.on("receiveCloseRoom", () => {
				handleReceiveCloseRoom();
			});
		}
		if (handleReceiveGameStart) {
			conn.on("receiveGameStart", () => {
				handleReceiveGameStart();
			});
		}
		if (handleReceiveGameEnd) {
			conn.on("receiveGameEnd", () => {
				handleReceiveGameEnd();
			});
		}

		async function start() {
			try {
				console.log("starting connection...");
				await conn.start();
				console.log("started connection");
				connectionRef.current = conn;

				// If the user is in a room, add them to the SignalR group
				if (roomCode) {
					await connectionRef.current.invoke("playerJoin", roomCode);
				}
			} catch (err) {
				connectionRef.current = null;
				console.error(err);
			}
		}

		start();

    const { current: connection } = connectionRef;

		return () => {
			async function stop() {
				if (
					connection &&
					connection.state !== HubConnectionState.Disconnected &&
					connection.state !== HubConnectionState.Connecting
				) {
					console.log("stopping connection...");
					await connection.stop();
					console.log("stopped connection");
				}
			}
			stop();
		};
	}, [roomCode]);

	return { connectionRef };
}
