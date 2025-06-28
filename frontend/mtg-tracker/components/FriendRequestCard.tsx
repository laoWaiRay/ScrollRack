import { ActionType as FriendActionType } from "@/context/FriendContext";
import { api } from "@/generated/client";
import { useFriend } from "@/hooks/useFriend";
import useToast from "@/hooks/useToast";
import { FriendRequestDTO, UserFriendAddDTO, UserReadDTO } from "@/types/client";
import { Button } from "@headlessui/react";
import FriendRequestUserCard from "./FriendRequestUserCard";
import { useFriendRequest } from "@/hooks/useFriendRequest";

interface FriendRequestCardInterface {
	user: UserReadDTO;
}

export default function FriendRequestCard({
	user,
}: FriendRequestCardInterface) {
	const { toast } = useToast();
  const { friends, dispatch: dispatchFriend } = useFriend();
  const { mutate } = useFriendRequest();

	async function handleAccept() {
		try {
      const userFriendAddDTO: UserFriendAddDTO = { id: user.id, requiresPermission: true };
			await api.postApiFriend(userFriendAddDTO, { withCredentials: true });
      dispatchFriend({ type: FriendActionType.UPDATE, payload: [ ...friends, user] });
      mutate();
			toast(`Added ${user.userName} to Friends`, "success");
		} catch (error) {
			toast("Error accepting friend request", "error");
		}
	}

	async function handleReject() {
    try {
      const receivedFriendRequests: FriendRequestDTO[] = await api.getApiFriendRequestreceived({ withCredentials: true });
      const toRemove = receivedFriendRequests.find(request => request.senderId == user.id);
      if (!toRemove || !toRemove.id) {
        return;
      }
      await api.deleteApiFriendRequestId(undefined, { params: { id: toRemove.id }, withCredentials: true }); 
      mutate();
    } catch (error) {
      console.log(error);
    }
  }

	return (
		<div className="flex flex-col gap-2 bg-card-surface border border-surface-500 px-4 py-3 rounded-lg">
			<h3 className="self-start">Friend Request</h3>
      <FriendRequestUserCard user={user} styles={"pl-4"} />
			<div className="flex gap-2 mt-1">
				<Button
					className="w-32 rounded-lg border border-error hover:bg-error text-error hover:text-white py-1 hover:cursor-pointer hover:saturate-200 font-semibold"
					onClick={handleReject}
				>
					Reject
				</Button>
				<Button
					className="w-32 rounded-lg border border-success hover:bg-success text-success hover:text-white py-1 hover:cursor-pointer hover:saturate-200 font-semibold"
					onClick={handleAccept}
				>
					Accept
				</Button>
			</div>
		</div>
	);
}
