import Footer from "@/components/Footer";
import { ReactNode } from "react";

interface layoutInterface {
	children: ReactNode;
}

export default function layout({ children }: layoutInterface) {
	return (
		<div className="w-full bg-surface-500">
			<div className="min-h-screen">{children}</div>
			<Footer />
		</div>
	);
}
