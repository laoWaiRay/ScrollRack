import Footer from "@/components/Footer";
import { ReactNode } from "react";

interface LoginLayoutProps {
	children: ReactNode;
}

export default function LoginLayout({ children }: LoginLayoutProps) {
	return (
		<div className="bg-gradient-hero">
			<main
				id="main-wrapper"
				className="min-h-dvh grid grid-cols-[repeat(12,_1fr)] gap-[20px] mx-[20px]"
			>
				{children}
			</main>
			<Footer />
		</div>
	);
}
