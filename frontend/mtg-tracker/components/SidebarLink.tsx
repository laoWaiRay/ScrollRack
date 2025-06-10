import Link from "next/link";

interface SidebarLink {
	children: React.ReactNode;
	href: string;
	isActive: boolean;
}

export default function SidebarLink({ children, href, isActive }: SidebarLink) {
	const activeLinkStyle = isActive
		? "bg-primary-500 hover:!bg-primary-400"
		: "";

	return (
		<Link
			href={href}
			className={`${activeLinkStyle} flex items-center justify-center xl:justify-start rounded text-fg-light 
      hover:bg-surface-400 py-4 lg:py-2 lg:p-md`}
		>
			<span className="xl:ml-3 flex items-center justify-start w-fit">
				{children}
			</span>
		</Link>
	);
}
