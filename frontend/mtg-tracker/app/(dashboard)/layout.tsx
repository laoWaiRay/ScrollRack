import Footer from "@/components/Footer";
import styles from "./styles.module.css";
import { ReactNode } from "react";
import Tower from "@/public/icons/tower.svg";
import LogScroll from "@/public/icons/log-scroll.svg";
import Cards from "@/public/icons/cards.svg";
import DoorEnter from "@/public/icons/door-enter.svg";
import DoorExit from "@/public/icons/door-exit.svg";
import User from "@/public/icons/user.svg";
import UsersMultiple from "@/public/icons/users-multiple.svg";
import UserRemove from "@/public/icons/user-remove.svg";
import UserAdd from "@/public/icons/user-add.svg";
import Settings from "@/public/icons/settings.svg";
import Search from "@/public/icons/search.svg";
import Bell from "@/public/icons/bell.svg";
import Filter from "@/public/icons/filter.svg";

interface HomepageLayoutProps {
	children: ReactNode;
}

export default function HomepageLayout({ children }: HomepageLayoutProps) {
	return (
		<div className="bg-surface-600">
			<main id="main-wrapper" className={`min-h-dvh ${styles.gridLayout}`}>
				<div
					className={`${styles.gridA} bg-amber-900 flex flex-col items-center`}
				>
					Sidebar
					<Tower className="h-[48px] aspect-square stroke-2" />
					<LogScroll className="h-[48px] aspect-square" />
					<Cards className="h-[48px] aspect-square" />
					<DoorEnter className="h-[48px] aspect-square" />
					<DoorExit className="h-[48px] aspect-square" />
					<User className="h-[48px] aspect-square" />
					<UsersMultiple className="h-[48px] aspect-square" />
					<UserRemove className="h-[48px] aspect-square" />
					<UserAdd className="h-[48px] aspect-square" />
					<Settings className="h-[48px] aspect-square" />
					<Search className="h-[48px] aspect-square" />
					<Bell className="h-[48px] aspect-square" />
					<Filter className="h-[48px] aspect-square" />
				</div>
				<div className={`${styles.gridB} bg-blue-900`}>Main</div>
				{children}
			</main>
			<Footer />
		</div>
	);
}
