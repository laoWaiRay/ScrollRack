"use client";
import Footer from "@/components/Footer";
import styles from "./styles.module.css";
import { ReactNode, useState } from "react";
import LogoImage from "@/public/icons/scroll.svg";
import Tower from "@/public/icons/tower.svg";
import LogScroll from "@/public/icons/log-scroll.svg";
import Cards from "@/public/icons/cards.svg";
import DoorEnter from "@/public/icons/door-enter.svg";
import DoorOpen from "@/public/icons/door-open.svg";
import User from "@/public/icons/user.svg";
import UsersMultiple from "@/public/icons/users-multiple.svg";
import UserRemove from "@/public/icons/user-remove.svg";
import Settings from "@/public/icons/settings.svg";
import Search from "@/public/icons/search.svg";
import Filter from "@/public/icons/filter.svg";
import UserAdd from "@/public/icons/user-add.svg";
import Bell from "@/public/icons/bell.svg";
import SidebarLink from "@/components/SidebarLink";
import { usePathname } from "next/navigation";
import Tooltip from "@/components/Tooltip";
import Hamburger from "@/components/animations/Hamburger";

interface HomepageLayoutProps {
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
		href: "/friends",
		name: "Friends",
		icon: UsersMultiple,
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

export default function HomepageLayout({ children }: HomepageLayoutProps) {
	const pathname = usePathname();
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

	function renderDesktopLinks(links: LinkData[]) {
		return links.map((data) => (
			<li key={data.name}>
				<Tooltip
					text={data.name}
					placement="right"
					_offset={15}
					styles="xl:hidden"
				>
					<SidebarLink href={data.href} isActive={pathname.includes(data.href)}>
						<data.icon className="w-[2em] h-[2em] stroke-2 xl:mr-2" />
						<span className="hidden xl:inline">{data.name}</span>
					</SidebarLink>
				</Tooltip>
			</li>
		));
	}

	function renderMobileLinks(links: LinkData[]) {
		return links.map((data) => (
			<li key={data.name}>
				<SidebarLink href={data.href} isActive={pathname.includes(data.href)} onClick={closeDrawer}>
					<data.icon className="w-[2em] h-[2em]" />
					<span className="ml-4">{data.name}</span>
				</SidebarLink>
			</li>
		));
	}

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
						<LogoImage
							title="Scroll with quill writing"
							className="text-white w-[1em] h-[1em] xl:mr-1"
						/>
						<span className="hidden xl:inline">ScrollRack</span>
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
        text-xl select-none p-4 z-90 bg-surface-500"
				>
					<div className="flex items-center justify-center ml-4">
						<LogoImage
							title="Scroll with quill writing"
							className="text-white w-[1em] h-[1em]"
						/>
						<span className="">ScrollRack</span>
					</div>
				</header>

				<div className="lg:hidden">
					<Hamburger onClick={() => setIsDrawerOpen(!isDrawerOpen)} />
				</div>

				{/* Hidden Drawer */}
				<div
					className={`w-screen h-screen overflow-y-auto bg-surface-600 fixed top-0 left-0 z-90 transition-all duration-700 ease-in-out flex flex-col
          justify-center ${!isDrawerOpen && "translate-x-[300%]"}`}
				>
					<div className="flex flex-col h-full mt-[80px]">
						<h2 className="text-fg-dark mb-2 flex justify-center">
							MAIN MENU
						</h2>
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
								linkData.filter(
									(data) => ["Account", "Settings"].includes(data.name)
								)
							)}
						</ul>
					</div>
				</div>

				{/* Main Content */}
				<main className={`${styles.gridB} bg-surface-600`}>{children}</main>
			</div>
			<Footer />
		</div>
	);
}
