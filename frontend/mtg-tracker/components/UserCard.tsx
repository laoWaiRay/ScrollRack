import { UserReadDTO } from "@/types/client";
import Image from "next/image";

interface UserCardInterface {
  user: UserReadDTO;
  styles?: string;
}

export default function UserCard({ user, styles }: UserCardInterface) {
	return (
		<div className={`flex gap-2 items-center ${styles}`}>
			<div className="w-[2em] h-[2em] rounded-full overflow-hidden">
				<Image
					className="h-full w-full object-cover"
					src={`${user?.profile ?? "/images/fblthp.jpeg"}`}
					height={64}
					width={64}
					alt="User avatar"
				/>
			</div>
			<span className="font-semibold text-fg-light">{user?.userName}</span>
		</div>
	);
}
