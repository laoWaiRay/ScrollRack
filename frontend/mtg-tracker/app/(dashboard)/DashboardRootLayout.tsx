"use client";
import Footer from "@/components/Footer";
import styles from "./styles.module.css";
import { ReactNode, useEffect, useState } from "react";
import LogoImage from "@/public/icons/scroll.svg";
import Tower from "@/public/icons/tower.svg";
import LogScroll from "@/public/icons/log-scroll.svg";
import Cards from "@/public/icons/cards.svg";
import DoorEnter from "@/public/icons/door-enter.svg";
import DoorOpen from "@/public/icons/door-open.svg";
import User from "@/public/icons/user.svg";
import UsersMultiple from "@/public/icons/users-multiple.svg";
import Settings from "@/public/icons/settings.svg";
import UserAdd from "@/public/icons/user-add.svg";
import Bell from "@/public/icons/bell.svg";
import SidebarLink from "@/components/SidebarLink";
import { usePathname, useRouter } from "next/navigation";
import Tooltip from "@/components/Tooltip";
import Hamburger from "@/components/animations/Hamburger";
import { getPath } from "@/helpers/url";
import Drawer from "@/components/Drawer";
import { useAuth } from "@/hooks/useAuth";
import { logout, tryRefreshTokens } from "@/actions/user";
import { ActionType as AuthActionType } from "@/context/AuthContext";
import { ActionType as RoomActionType } from "@/context/RoomContext";
import { defaultGameState, ActionType as GameActionType } from "@/context/GameContext";
import { useRoom } from "@/hooks/useRoom";
import { useGame } from "@/hooks/useGame";
import { getRooms } from "@/actions/rooms";
import { getGames } from "@/actions/games";
import { extractAuthResult } from "@/helpers/extractAuthResult";

interface DashboardRootLayoutProps {
	children: ReactNode;
}

interface LinkData {
	href: string;
	name: string;
	icon: any;
}

const linkData: LinkData[] = [
	{
		href: "/commandzone",
		name: "Command Zone",
		icon: Tower,
	},
	{
		href: "/decks",
		name: "Decks",
		icon: Cards,
	},
	{
		href: "/log",
		name: "Game Log",
		icon: LogScroll,
	},
	{
		href: "/pod/join",
		name: "Join Pod",
		icon: DoorEnter,
	},
	{
		href: "/pod/create",
		name: "Create Pod",
		icon: DoorOpen,
	},
	{
		href: "/friends",
		name: "Friends",
		icon: UsersMultiple,
	},
	{
		href: "/account",
		name: "Account",
		icon: User,
	},
	{
		href: "/settings",
		name: "Settings",
		icon: Settings,
	},
];

const mobileOnlyLinkData: LinkData[] = [
	{
		href: "/friends/add",
		name: "Add Friend",
		icon: UserAdd,
	},
	{
		href: "/notifications",
		name: "Notifications",
		icon: Bell,
	},
];

export default function DashboardRootLayout({
	children,
}: DashboardRootLayoutProps) {
	const pathname = usePathname();
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const router = useRouter();
	const { user, dispatch: dispatchAuth } = useAuth();
	const { dispatch: dispatchRoom } = useRoom();
	const { dispatch: dispatchGameState } = useGame();

	useEffect(() => {
	  // If user was null, try to refresh the access token and update all context data.
		async function run() {
			try {
	      const userData = await tryRefreshTokens();
	      const roomAuthResult = await getRooms();
	      const roomData = extractAuthResult(roomAuthResult);
	      const gameAuthResult = await getGames();
	      const gameData = extractAuthResult(gameAuthResult);
	      dispatchAuth({ type: AuthActionType.LOGIN, payload: userData });
	      dispatchRoom({ type: RoomActionType.UPDATE , payload: roomData ?? [] });
	      dispatchGameState({ type: GameActionType.UPDATE, payload: gameData?.games ?? defaultGameState.games });
	      dispatchGameState({ type: GameActionType.SET_HAS_MORE, payload: gameData?.hasMore ?? defaultGameState.hasMore });
	      dispatchGameState({ type: GameActionType.SET_PAGE, payload: gameData?.page ?? defaultGameState.page });
			} catch (error) {
	      console.log(error);
				if (pathname !== "/login") {
					await logout();
					router.push("/login");
				}
			}
		}

		if (!user) {
			run();
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	function renderDesktopLinks(links: LinkData[]) {
		return links.map((data) => (
			<li key={data.name} className="z-10">
				<Tooltip
					text={data.name}
					placement="right"
					_offset={15}
					styles="xl:hidden"
				>
					<SidebarLink
						href={data.href}
						isActive={getPath(pathname) === data.href}
					>
						<data.icon className="size-[2em] xl:size-[1.5em] stroke-2 xl:mr-2" />
						<span className="hidden xl:inline">{data.name}</span>
					</SidebarLink>
				</Tooltip>
			</li>
		));
	}

	function renderMobileLinks(links: LinkData[]) {
		return links.map((data) => (
			<li key={data.name} tabIndex={-1}>
				<SidebarLink
					href={data.href}
					isActive={getPath(pathname) === data.href}
					onClick={() => setIsDrawerOpen(false)}
					isTabbable={false}
				>
					<data.icon className="w-[2em] h-[2em]" />
					<span className="ml-4">{data.name}</span>
				</SidebarLink>
			</li>
		));
	}

	useEffect(() => {
		if (isDrawerOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}

		return () => {
			document.body.style.overflow = "";
		};
	}, [isDrawerOpen]);

	return (
		<div className="bg-surface-600">
			<div
				id="main-wrapper"
				className={`min-h-dvh ${styles.gridLayout} bg-surface-500 relative`}
			>
				{/* Desktop Sidebar */}
				<nav
					aria-labelledby="Sidebar navigation"
					className={`${styles.gridA} hidden lg:flex flex-col items-stretch lg:mx-2 lg:sticky lg:h-screen lg:top-0 bg-surface-500 z-10`}
				>
					<header className="font-dancing-script text-white text-xl flex items-center justify-center xl:justify-start select-none my-4 mx-5">
						<div
							className="flex items-center hover:cursor-pointer"
							onClick={() => router.push("/commandzone")}
						>
							<LogoImage
								title="Scroll with quill writing"
								className="text-white w-[1em] h-[1em] xl:mr-1"
							/>
							<span className="hidden xl:inline">ScrollRack</span>
						</div>
					</header>

					<div className="grow flex flex-col justify-between">
						<div>
							<h2 className="text-fg-dark text-sm mb-2 mx-5 hidden xl:block">
								MAIN MENU
							</h2>
							<ul className="flex flex-col gap-2">
								{renderDesktopLinks(
									linkData.filter(
										(data) => !["Account", "Settings"].includes(data.name)
									)
								)}
							</ul>
						</div>

						<div className="mb-4">
							<h2 className="text-fg-dark text-sm mb-2 mx-5 hidden xl:block">
								PROFILE
							</h2>
							<ul className="flex flex-col gap-2">
								{renderDesktopLinks(
									linkData.filter((data) =>
										["Account", "Settings"].includes(data.name)
									)
								)}
							</ul>
						</div>
					</div>
				</nav>

				{/* Mobile Top Navigation */}
				<header
					className="lg:hidden flex fixed w-screen justify-between items-center font-dancing-script text-white 
        text-xl select-none p-4 z-90 bg-surface-600 border-b border-surface-500"
				>
					<div
						className="flex items-center justify-center ml-4 hover:cursor-pointer"
						onClick={() => router.push("/commandzone")}
					>
						<LogoImage
							title="Scroll with quill writing"
							className="text-white w-[1em] h-[1em] mr-[4px]"
						/>
						<span className="">ScrollRack</span>
					</div>
				</header>

				<div className="lg:hidden">
					<Hamburger
						onClick={() => setIsDrawerOpen(!isDrawerOpen)}
						isActive={isDrawerOpen}
					/>
				</div>

				{/* Hidden Drawer */}
				<Drawer isDrawerOpen={isDrawerOpen} maxWidth="none">
					<h2 className="text-fg-dark mb-2 flex justify-center">MAIN MENU</h2>
					<ul className="flex flex-col gap-2">
						{renderMobileLinks(
							linkData.filter(
								(data) => !["Account", "Settings"].includes(data.name)
							)
						)}
						{renderMobileLinks(mobileOnlyLinkData)}
					</ul>

					<h2 className="text-fg-dark mt-4 mb-2 flex justify-center">
						PROFILE
					</h2>
					<ul className="flex flex-col gap-2">
						{renderMobileLinks(
							linkData.filter((data) =>
								["Account", "Settings"].includes(data.name)
							)
						)}
					</ul>
				</Drawer>

				{/* Main Content */}
				<main className={`${styles.gridB} bg-surface-600`}>{children}</main>
			</div>
			<Footer />
		</div>
	);
}
