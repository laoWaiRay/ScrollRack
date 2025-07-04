"use client";
import ButtonIcon from "@/components/ButtonIcon";
import ButtonPrimary from "@/components/ButtonPrimary";
import {
	DashboardLayout,
	DashboardHeader,
	DashboardMain,
} from "@/components/Dashboard";
import RoomCodeInput from "@/components/RoomCodeInput";
import { useAuth } from "@/hooks/useAuth";
import { useRoom } from "@/hooks/useRoom";
import useToast from "@/hooks/useToast";
import Exit from "@/public/icons/exit.svg";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CONFLICT, NOT_FOUND } from "@/constants/httpStatus";
import { ActionType } from "@/context/RoomContext";
import Dialog from "@/components/Dialog";
import { useRoomConnection } from "@/hooks/useRoomConnection";
import { deleteRoom, getRooms, joinRoom } from "@/actions/rooms";
import { extractAuthResult } from "@/helpers/extractAuthResult";
import { ServerApiError } from "@/types/server";

export default function JoinPod() {
	const { toast } = useToast();
	const { user } = useAuth();
	const { rooms, dispatch } = useRoom();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [roomCode, setRoomCode] = useState(Array(6).fill(""));
	const router = useRouter();

	const hostedRoom = rooms.find((r) => r.roomOwnerId === user?.id);
	const joinedRoom = rooms.find(
		(r) =>
			user &&
			r.roomOwnerId !== user.id &&
			r.players?.find((player) => player.id === user.id)
	);

	const handleReceivePlayerAdd = async () => {
    try {
      const authResult = await getRooms();
      const updatedRooms = extractAuthResult(authResult) ?? [];
      dispatch({ type: ActionType.UPDATE, payload: updatedRooms });
    } catch (error) {
      console.log(error);
    }
	};

	const handleReceivePlayerRemove = async () => {
    try {
      const authResult = await getRooms();
      const updatedRooms = extractAuthResult(authResult) ?? [];
      dispatch({ type: ActionType.UPDATE, payload: updatedRooms });
    } catch (error) {
      console.log(error);
    }
	};

	const handleReceiveCloseRoom = async () => {
    try {
      const authResult = await getRooms();
      const updatedRooms = extractAuthResult(authResult) ?? [];
      dispatch({ type: ActionType.UPDATE, payload: updatedRooms });
    } catch (error) {
      console.log(error);
    }
	};

	const { connectionRef } = useRoomConnection(joinedRoom?.code ?? null, {
		handleReceivePlayerAdd,
		handleReceivePlayerRemove,
		handleReceiveCloseRoom,
	});

	async function handleJoin() {
		if (hostedRoom || joinedRoom) {
			toast("Already in a pod", "warn");
			return;
		}

		try {
      const authResult = await joinRoom(roomCode.join(""));
      const room = extractAuthResult(authResult);
      
      if (room) {
        dispatch({ type: ActionType.UPDATE, payload: [room] });
        toast("Joined pod", "success");
      } else {
        throw Error("No room")
      }
		} catch (error) {
			if (error instanceof ServerApiError) {
				if (error.status === NOT_FOUND) {
					toast("Pod not found", "warn");
					return;
				} else if (error.status === CONFLICT) {
					toast("Already joined pod", "warn");
					return;
				}
			}
			toast("Error joining pod", "warn");
		}
	}

	async function handleLeaveRoom() {
		if (rooms.length === 0 || !joinedRoom) {
			toast("Already left pod", "warn");
			return;
		}

		try {
			if (connectionRef.current) {
				await connectionRef.current.invoke("playerLeave", joinedRoom.code);
			} else {
				console.log("ERROR: NO CONNECTION REF");
			}
      const authResult = await deleteRoom();
      extractAuthResult(authResult);
			dispatch({ type: ActionType.UPDATE, payload: [] });
		} catch (error) {
      console.log(error);
			toast("Error leaving pod", "warn");
		}
	}

	return (
		<DashboardLayout>
			<DashboardHeader title="Join Pod" user={user}>
				<ButtonIcon
					styles={`size-[2em] active:text-white hover:text-white ${
						!joinedRoom && "hidden"
					}`}
					onClick={() => setIsDialogOpen(true)}
				>
					<Exit />
				</ButtonIcon>
			</DashboardHeader>
			<DashboardMain>
				{hostedRoom ? (
					<div className="flex flex-col gap-2">
						<div className="text-base mt-4">
							Cannot join a pod while currently hosting one
						</div>

						<div className="w-fit self-center">
							<ButtonPrimary
								onClick={() => router.push("/pod/create")}
								uppercase={false}
							>
								Go to Hosted Pod
							</ButtonPrimary>
						</div>
					</div>
				) : joinedRoom ? (
					<>
						{/* Warning Modal for Leaving Room */}
						<Dialog
							title="Leave Pod"
							description="Remember to save any in progress games before leaving."
							isDialogOpen={isDialogOpen}
							setIsDialogOpen={setIsDialogOpen}
							onConfirm={() => handleLeaveRoom()}
						/>
						<div>
							<div className="flex flex-col items-center mb-2 mt-6">
								<span className="text-xl">Joined Pod:</span>
								<span className="text-xl uppercase font-bold tracking-wide text-white px-3 py-3 bg-primary-400 rounded-xl my-2">
									{joinedRoom.code.slice(0, 3) + " " + joinedRoom.code.slice(3)}
								</span>
							</div>
						</div>
					</>
				) : (
					<div className="flex flex-col gap-4 mt-4">
						<h3 className="text-xl">Enter Room Code</h3>
						<RoomCodeInput
							roomCode={roomCode}
							setRoomCode={setRoomCode}
							onSubmit={() => handleJoin()}
						/>
						<div className="mt-4 -mb-3 flex w-full justify-center items-center gap-4 px-8 max-w-sm">
							<ButtonPrimary onClick={handleJoin} style="primary" uppercase={false}>
								Join Pod
							</ButtonPrimary>
						</div>
					</div>
				)}
			</DashboardMain>
		</DashboardLayout>
	);
}
