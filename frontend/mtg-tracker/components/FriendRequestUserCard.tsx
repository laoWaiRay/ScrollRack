import { UserReadDTO } from "@/types/client";
import Image from "next/image";

interface FriendRequestUserCardInterface {
	user: UserReadDTO;
  styles: string;
}

export default function FriendRequestUserCard({
	user,
  styles,
}: FriendRequestUserCardInterface) {
	return (
		<div
			className={`flex gap-2 items-center z-10 border border-surface-500 py-2 px-4 rounded-lg ${styles}`}
		>
			<div className="w-[2em] h-[2em] rounded-full overflow-hidden shrink-0">
				<Image
					className="h-full w-full object-cover"
					src={`${user?.profile ?? "/images/fblthp.jpeg"}`}
					height={64}
					width={64}
					alt="User avatar"
				/>
			</div>
			<span className={`font-semibold`}>{user?.userName}</span>
		</div>
	);
}
