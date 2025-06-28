"use client";
import _styles from "./DashboardStyles.module.css";
import { ReactNode } from "react";
import {
	Popover,
	PopoverButton,
	PopoverPanel,
	CloseButton,
	Menu,
	MenuButton,
	MenuItems,
	MenuItem,
} from "@headlessui/react";
import ButtonIcon from "./ButtonIcon";
import Image from "next/image";
import Bell from "@/public/icons/bell.svg";
import Close from "@/public/icons/close.svg";
import UserAdd from "@/public/icons/user-add.svg";
import { UserReadDTO } from "@/types/client";
import FriendRequestCard from "./FriendRequestCard";
import { useFriendRequest } from "@/hooks/useFriendRequest";
import { useRouter } from "next/navigation";

interface DashboardLayoutInterface {
	children: ReactNode;
	styles?: string;
}

interface DashboardMainInterface {
	children: ReactNode;
	styles?: string;
}

interface DashboardHeaderInterface {
	user: UserReadDTO | null;
	title: string;
	justify?: "justify-start" | "justify-between";
	children?: ReactNode;
	childrenStyles?: string;
}

export function DashboardLayout({
	children,
	styles,
}: DashboardLayoutInterface) {
	return (
		<div
			className={`${_styles.gridB} flex flex-col items-center lg:m-4 min-h-dvh lg:mt-4 mx-3`}
		>
			{/* Make room for the navbar on mobile */}
			<div className="pt-24 w-full lg:pt-0 grow flex flex-col items-center">
				{children}
			</div>
		</div>
	);
}

export function DashboardHeader({
	user,
	title,
	children,
	childrenStyles,
	justify = "justify-between",
}: DashboardHeaderInterface) {
	const buttonIconStyle = "p-1 mx-1 hover:text-fg-light";
	const { friendRequests } = useFriendRequest();
	const router = useRouter();

	return (
		<div className="border-b border-surface-500 w-full pb-4 lg:pb-2.5 mb-2 lg:mb-4">
			<div className={`flex ${justify} lg:justify-between items-center mx-4`}>
				<div className="flex gap-8 items-center justify-start">
					<div className="text-lg font-semibold select-none shrink-0">
						{title}
					</div>
					<div className={`${childrenStyles} hidden lg:block`}>{children}</div>
				</div>
				<div className={`${childrenStyles} flex justify-start lg:hidden`}>
					{children}
				</div>
				<div className={`text-lg items-center justify-between hidden lg:flex`}>
					{/* User Controls */}
					<ButtonIcon
						onClick={() => router.push("/friends/add")}
						styles={buttonIconStyle}
					>
						<UserAdd className="w-[1.5em] h-[1.5em] stroke-1" />
					</ButtonIcon>

					<Popover>
						<PopoverButton
							className={`${buttonIconStyle} rounded hover:cursor-pointer`}
						>
							<Bell className="w-[1.5em] h-[1.5em] stroke-1" />
						</PopoverButton>
						<PopoverPanel
							anchor="bottom"
							className="flex flex-col bg-surface-600 py-2 px-2 mt-2.5 z-10 rounded-lg border border-surface-500 relative shadow-2xl w-xs"
						>
							<CloseButton className="absolute top-[10px] right-2.5 size-[1.2em] hover:cursor-pointer hover:text-white">
								<Close />
							</CloseButton>
							<h3 className="uppercase text-sm self-center mb-2">
								Notifications
							</h3>
							<div className="flex flex-col gap-2">
								{friendRequests.length ? (
									friendRequests.map((request) => (
										<FriendRequestCard key={request.id} user={request} />
									))
								) : (
									<div className="flex flex-col gap-3 bg-black/20 px-4 py-3 rounded-lg">
										No new notifications
									</div>
								)}
							</div>
						</PopoverPanel>
					</Popover>

					{/* User Profile Card  */}

					<Menu>
						<MenuButton
							className="flex items-center justify-center gap-3 py-2 pl-3 pr-4 ml-1 rounded data-hover:cursor-pointer data-hover:bg-white/5"
						>
							<div className="w-[2em] h-[2em] rounded-full overflow-hidden">
								<Image
									className="h-full w-full object-cover"
									src={`${user?.profile ?? "/images/fblthp.jpeg"}`}
									height={64}
									width={64}
									alt="User avatar"
								/>
							</div>
							<div className="text-base text-fg-light select-none">
								{user?.userName}
							</div>
						</MenuButton>
						<MenuItems
							anchor="bottom"
							className="bg-surface-600 border border-surface-500 rounded mt-2 min-w-(--button-width)"
						>
							<MenuItem>
								<div
									className="px-2.5 py-2 select-none data-focus:bg-white/5 border-b border-surface-500/50"
									onClick={() => {}}
								>
									<span>Log Out</span>
								</div>
							</MenuItem>
						</MenuItems>
					</Menu>
				</div>
			</div>
		</div>
	);
}

export function DashboardMain({ children, styles }: DashboardMainInterface) {
	return (
		<div
			className={`lg:h-full w-full lg:max-w-7xl flex flex-col justify-start items-center grow ${styles}`}
		>
			{children}
		</div>
	);
}
