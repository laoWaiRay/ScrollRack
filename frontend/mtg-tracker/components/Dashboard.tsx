import _styles from "./DashboardStyles.module.css";
import { ReactNode } from "react";
import { Button } from "@headlessui/react";
import ButtonIcon from "./ButtonIcon";
import Tooltip from "./Tooltip";
import Image from "next/image";
import Bell from "@/public/icons/bell.svg";
import UserAdd from "@/public/icons/user-add.svg";
import { UserReadDTO } from "@/types/client";

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
}

export function DashboardLayout({ children, styles }: DashboardLayoutInterface) {
	return (
		<div
			className={`${_styles.gridB} flex flex-col items-center m-0 lg:m-4 min-h-dvh lg:mt-4 mx-3`}
		>
      {/* Make room for the navbar on mobile */}
      <div className="pt-24 w-full lg:pt-0 grow flex flex-col items-center">
        {children}
      </div>
		</div>
	);
}

export function DashboardHeader({ user, title }: DashboardHeaderInterface) {
	const buttonIconStyle = "p-1 mx-1 hover:text-fg-light";

	return (
		<div className="border-b-2 border-surface-500 w-full pb-4 lg:pb-2.5 mb-2 lg:mb-4">
			<div className="flex justify-between items-center mx-4">
				<div className="text-lg font-semibold select-none">{ title }</div>
				<div className="text-lg items-center justify-between hidden lg:flex">
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
					<Button
						className="flex items-center justify-center gap-3 py-2 px-3 ml-1 rounded
            data-hover:cursor-pointer data-hover:bg-surface-500"
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
					</Button>
				</div>
			</div>
		</div>
	);
}

export function DashboardMain({ children, styles }: DashboardMainInterface) {
	return (
		<div className={`lg:h-full w-full lg:max-w-[1480px] flex justify-center items-start grow ${styles}`}>
			{children}
		</div>
	);
}
