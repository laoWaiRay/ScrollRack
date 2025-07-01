import Link from "next/link";
import { ReactNode } from "react";

interface ButtonLinkInterface {
	children: ReactNode;
	href: string;
	style?: "primary" | "secondary" | "transparent";
	uppercase?: boolean;
	styles?: string;
}

export default function ButtonLink({
	children,
	href,
	style = "primary",
	uppercase = true,
	styles,
}: ButtonLinkInterface) {
	let buttonStyle = "";
	if (style === "primary") {
		buttonStyle = "bg-primary-300 text-white";
	}
	if (style === "secondary") {
		buttonStyle = "bg-surface-500";
	}
	if (style === "transparent") {
		buttonStyle = "bg-transparent text-fg hover:text-white";
	}

	const caseStyle = uppercase ? "text-sm uppercase" : "text-base"

		return (
			<Link
				href={href}
				className={`${buttonStyle} px-4 py-3 rounded-lg ${caseStyle} ${styles}`}
			>
				{children}
			</Link>
		);
}
