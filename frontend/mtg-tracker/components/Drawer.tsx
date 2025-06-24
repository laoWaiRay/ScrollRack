import { ReactNode } from "react";

interface DrawerInterface {
	children: ReactNode;
	isDrawerOpen: boolean;
	zIndex?: string;
}

export default function Drawer({
	children,
	isDrawerOpen,
	zIndex = "z-90",
}: DrawerInterface) {
	return (
		<div
			className={`w-screen h-dvh overflow-y-auto bg-surface-600 fixed inset-0 ${zIndex} transition-transform duration-300 ease-in-out flex justify-center items-start
          ${!isDrawerOpen && "translate-x-[300%]"}`}
		>
			<div className="flex flex-col mt-[calc(80px_+_2rem)] justify-center w-full max-w-md">
				{children}
			</div>
		</div>
	);
}
