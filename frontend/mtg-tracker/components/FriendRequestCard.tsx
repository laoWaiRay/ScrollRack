"use client"
import { ActionType as FriendActionType } from "@/context/FriendContext";
import { useFriend } from "@/hooks/useFriend";
import useToast from "@/hooks/useToast";
import { UserFriendAddDTO, UserReadDTO } from "@/types/client";
import { Button } from "@headlessui/react";
import FriendRequestUserCard from "./FriendRequestUserCard";
import { useFriendRequest } from "@/hooks/useFriendRequest";
import { extractAuthResult } from "@/helpers/extractAuthResult";
import { acceptFriendRequest, deleteFriendRequest, getReceivedFriendRequests } from "@/actions/friendRequests";
import { useState } from "react";

interface FriendRequestCardInterface {
	user: UserReadDTO;
}

export default function FriendRequestCard({
	user,
}: FriendRequestCardInterface) {
	const { toast } = useToast();
  const { friends, dispatch: dispatchFriend } = useFriend();
  const { mutate } = useFriendRequest();
  const [isFetching, setIsFetching] = useState(false);

	async function handleAccept() {
		try {
      setIsFetching(true);
      const userFriendAddDTO: UserFriendAddDTO = { id: user.id, requiresPermission: true };
      const authResult = await acceptFriendRequest(userFriendAddDTO);
      extractAuthResult(authResult);
      dispatchFriend({ type: FriendActionType.UPDATE, payload: [ ...friends, user] });
      mutate();
			toast(`Added ${user.userName} to Friends`, "success");
      setIsFetching(false);
		} catch (error) {
      setIsFetching(false);
      console.log(error);
			toast("Error accepting friend request", "error");
		}
	}

	async function handleReject() {
    try {
      setIsFetching(true);
      const authResult = await getReceivedFriendRequests();
      const receivedFriendRequests = extractAuthResult(authResult) ?? [];
      const toRemove = receivedFriendRequests.find(request => request.senderId == user.id);
      if (!toRemove || !toRemove.id) {
        setIsFetching(false);
        return;
      }
      const deleteAuthResult = await deleteFriendRequest(toRemove.id);
      extractAuthResult(deleteAuthResult);
      mutate();
    } catch (error) {
      console.log(error);
    }
    setIsFetching(false);
  }

	return (
		<div className="flex flex-col gap-2 bg-card-surface border border-surface-500 px-4 py-3 rounded-lg">
			<h3 className="self-start">Friend Request</h3>
      <FriendRequestUserCard user={user} styles={"pl-4"} />
			<div className="flex gap-2 mt-1">
				<Button
					className="w-32 rounded-lg border border-error hover:bg-error text-error hover:text-white py-1 hover:cursor-pointer hover:saturate-200 font-semibold disabled:opacity-50"
					onClick={handleReject}
          disabled={isFetching}
				>
					Reject
				</Button>
				<Button
					className="w-32 rounded-lg border border-success hover:bg-success text-success hover:text-white py-1 hover:cursor-pointer hover:saturate-200 font-semibold disabled:opacity-50"
					onClick={handleAccept}
          disabled={isFetching}
				>
					Accept
				</Button>
			</div>
		</div>
	);
}
