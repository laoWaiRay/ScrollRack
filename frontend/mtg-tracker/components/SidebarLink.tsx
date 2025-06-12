import Link from "next/link";

interface SidebarLink {
	children: React.ReactNode;
	href: string;
	isActive: boolean;
  onClick?: () => void;
}

export default function SidebarLink({ children, href, isActive, onClick }: SidebarLink) {
	const activeLinkStyle = isActive
		? "bg-primary-400 hover:!bg-primary-300"
		: "";

	return (
		<Link
			href={href}
      onClick={onClick}
			className={`${activeLinkStyle} flex items-center justify-center xl:justify-start rounded text-fg-light 
      hover:bg-surface-400 py-2.5 lg:py-2 lg:p-md`}
		>
			<span className="xl:ml-3 flex items-center justify-start w-fit">
				{children}
			</span>
		</Link>
	);
}
