"use client";
import Footer from "@/components/Footer";
import styles from "./styles.module.css";
import { ReactNode } from "react";
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
import SidebarLink from "@/components/SidebarLink";
import { usePathname } from "next/navigation";
import Tooltip from "@/components/Tooltip";

interface HomepageLayoutProps {
	children: ReactNode;
}

export default function HomepageLayout({ children }: HomepageLayoutProps) {
	const pathname = usePathname();

	return (
		<div className="bg-surface-600">
			<div
				id="main-wrapper"
				className={`min-h-dvh ${styles.gridLayout} bg-surface-500`}
			>
				{/* Sidebar */}
				<nav
					aria-labelledby="Sidebar navigation"
					className={`${styles.gridA} flex flex-col items-stretch mx-2 sticky h-screen top-0 bg-surface-500 z-10`}
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
								<li className="flex flex-col gap-2">
									<Tooltip
										text="Command Zone"
										placement="right"
										_offset={15}
										styles="xl:hidden"
									>
										<SidebarLink
											href="/commandzone"
											isActive={pathname.includes("/commandzone")}
										>
											<Tower className="w-[2em] h-[2em] stroke-2 xl:mr-2" />
											<span className="hidden xl:inline">Command Zone</span>
										</SidebarLink>
									</Tooltip>

									<Tooltip
										text="Decks"
										placement="right"
										_offset={15}
										styles="xl:hidden"
									>
										<SidebarLink
											href="/decks"
											isActive={pathname.includes("/decks")}
										>
											<Cards className="w-[2em] h-[2em] stroke-2 xl:mr-2" />
											<span className="hidden xl:inline">Decks</span>
										</SidebarLink>
									</Tooltip>

									<Tooltip
										text="Friends"
										placement="right"
										_offset={15}
										styles="xl:hidden"
									>
										<SidebarLink
											href="/friends"
											isActive={pathname.includes("/friends")}
										>
											<UsersMultiple className="w-[2em] h-[2em] stroke-2 xl:mr-2" />
											<span className="hidden xl:inline">Friends</span>
										</SidebarLink>
									</Tooltip>

									<Tooltip
										text="Game Log"
										placement="right"
										_offset={15}
										styles="xl:hidden"
									>
										<SidebarLink
											href="/log"
											isActive={pathname.includes("/log")}
										>
											<LogScroll className="w-[2em] h-[2em] stroke-2 xl:mr-2" />
											<span className="hidden xl:inline">Game Log</span>
										</SidebarLink>
									</Tooltip>

									<Tooltip
										text="Join Pod"
										placement="right"
										_offset={15}
										styles="xl:hidden"
									>
										<SidebarLink
											href="/pod/join"
											isActive={pathname.includes("/pod/join")}
										>
											<DoorEnter className="w-[2em] h-[2em] stroke-2 xl:mr-2" />
											<span className="hidden xl:inline">Join Pod</span>
										</SidebarLink>
									</Tooltip>

									<Tooltip
										text="Create Pod"
										placement="right"
										_offset={15}
										styles="xl:hidden"
									>
										<SidebarLink
											href="/pod/create"
											isActive={pathname.includes("/pod/create")}
										>
											<DoorOpen className="w-[2em] h-[2em] stroke-2 xl:mr-2" />
											<span className="hidden xl:inline">Create Pod</span>
										</SidebarLink>
									</Tooltip>
								</li>
							</ul>
						</div>

						<div className="mb-4">
							<h2 className="text-fg-dark text-sm mb-2 mx-5 hidden xl:block">
								PROFILE
							</h2>
							<ul className="flex flex-col gap-2">
								<li>
									<Tooltip
										text="Account"
										placement="right"
										_offset={15}
										styles="xl:hidden"
									>
										<SidebarLink
											href="/account"
											isActive={pathname.includes("/account")}
										>
											<User className="w-[2em] h-[2em] stroke-2 xl:mr-2" />
											<span className="hidden xl:inline">Account</span>
										</SidebarLink>
									</Tooltip>

									<Tooltip
										text="Settings"
										placement="right"
										_offset={15}
										styles="xl:hidden"
									>
										<SidebarLink
											href="/settings"
											isActive={pathname.includes("/settings")}
										>
											<Settings className="w-[2em] h-[2em] stroke-2 xl:mr-2" />
											<span className="hidden xl:inline">Settings</span>
										</SidebarLink>
									</Tooltip>
								</li>
							</ul>
						</div>
					</div>
				</nav>

				{/* Main Content */}
				<main className={`${styles.gridB} bg-surface-600`}>{children}</main>
			</div>
			<Footer />
		</div>
	);
}
