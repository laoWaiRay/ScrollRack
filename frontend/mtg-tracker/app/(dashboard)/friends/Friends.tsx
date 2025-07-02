"use client";
import ButtonIcon from "@/components/ButtonIcon";
import ComboBox from "@/components/ComboBox";
import {
	DashboardLayout,
	DashboardHeader,
	DashboardMain,
} from "@/components/Dashboard";
import DeckDisplay from "@/components/DeckDisplay";
import { useAuth } from "@/hooks/useAuth";
import { useFriend } from "@/hooks/useFriend";
import { useState } from "react";
import UserRemove from "@/public/icons/user-remove.svg";
import { useFriendDeck } from "@/hooks/useFriendDeck";
import Dialog from "@/components/Dialog";
import useToast from "@/hooks/useToast";
import { ActionType } from "@/context/FriendContext";
import { deleteFriend } from "@/actions/friends";
import { extractAuthResult } from "@/helpers/extractAuthResult";

export default function Friends() {
	const { user } = useAuth();
	const { friends, dispatch } = useFriend();
	const [selected, setSelected] = useState<string | null>(null);
	const [query, setQuery] = useState("");
  const friendId = friends.find(f => f.userName === selected)?.id;
  const { decks, isLoading } = useFriendDeck(friendId ?? "");
	const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  async function handleDeleteFriend() {
    if (!friendId) {
      return;
    }
    const friendName = selected;

    try {
      const authResult = await deleteFriend(friendId);
      extractAuthResult(authResult);
      dispatch({ type: ActionType.UPDATE, payload: friends.filter(f => f.id !== friendId) });
      setSelected(null);
      setQuery("");
      toast(`Removed ${friendName} from friends`, "success");
    } catch (error) {
      console.log(error);
      toast(`Error while removing ${friendName} from friends`, "warn");
    }
  }

	return (
		<DashboardLayout>
			<DashboardHeader title="Friends" user={user}></DashboardHeader>
			<DashboardMain>
        <Dialog
          title="Removing Friend"
          description={`Are you sure you want to remove "${selected}" from your friends list? Game data will not be affected, but you will no longer be able to view each other's decks.`}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          onConfirm={() => handleDeleteFriend()}
          useCountdown={true}
        />
				<section className="flex flex-col w-full max-w-md lg:max-w-3xl">
					<div className="pt-3.5 pb-5 px-2 flex gap-2 border-b border-surface-500">
						<ButtonIcon onClick={() => setIsDialogOpen(true)} disabled={!selected}>
							<div className="w-[2.5em] border border-surface-500 rounded p-1">
								<UserRemove />
							</div>
						</ButtonIcon>
						<ComboBox
							list={friends.map((f) => f.userName)}
							query={query}
							setQuery={setQuery}
							selected={selected}
							setSelected={setSelected}
              size="sm"
						/>
					</div>
					<DeckDisplay decks={decks} isLoading={isLoading} />
				</section>
			</DashboardMain>
		</DashboardLayout>
	);
}
