"use client";
import styles from "../styles.module.css";
import Bell from "@/public/icons/bell.svg";
import UserAdd from "@/public/icons/user-add.svg";
import ButtonIcon from "@/components/ButtonIcon";
import Tooltip from "@/components/Tooltip";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@headlessui/react";

export default function CommandZone() {
	const { user } = useAuth();
	const buttonIconStyle = "p-1 mx-1 hover:text-fg-light";

	return (
		<div className={`${styles.gridB} flex flex-col items-start m-4 min-h-dvh`}>
			{/* Main Header */}
			<div className="border-b-2 border-surface-500 w-full pb-2.5">
				<div className="flex justify-between items-center mx-4">
					<div className="text-lg font-semibold select-none">Command Zone</div>
					<div className="text-lg flex items-center justify-between">
						{/* User Controls */}
						<Tooltip text="Add Friends">
							<ButtonIcon onClick={() => {}} styles={buttonIconStyle}>
								<UserAdd className="w-[1.5em] h-[1.5em] stroke-1" />
							</ButtonIcon>
						</Tooltip>

						<Tooltip text="Notifications">
							<ButtonIcon onClick={() => {}} styles={buttonIconStyle}>
								<Bell className="w-[1.5em] h-[1.5em] stroke-1" />
							</ButtonIcon>
						</Tooltip>

						{/* User Profile Card  */}
						<Button className="flex items-center justify-center gap-3 py-2 px-3 ml-1 rounded
            data-hover:cursor-pointer data-hover:bg-surface-500">
							<div className="w-[1.5em] h-[1.5em] d overflow-hidden">
								<Image
									className="h-full w-full object-cover"
									src="/mock/avatar.png"
									height={32}
									width={32}
									alt="User avatar"
								/>
							</div>
							<div className="text-base select-none">{user?.userName}</div>
						</Button>
					</div>
				</div>
			</div>
      
      {/* Main Content */}
      <p>{JSON.stringify(user)}</p> 
		</div>
	);
}
