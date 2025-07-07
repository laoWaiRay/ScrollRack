// This makes the root layout dynamically rendered and fixes strange build issue:
// Error occurred prerendering page "/_not-found". Read more: https://nextjs.org/docs/messages/prerender-error
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { Commissioner, Dancing_Script } from "next/font/google";
import "./globals.css";
import RootLayout from "./RootLayout";

export const metadata: Metadata = {
	title: "ScrollRack",
	description: "A Commander stat tracker for Magic: The Gathering®",
};

const commissioner = Commissioner({
	subsets: ["latin"],
});

const dancingScript = Dancing_Script({
	subsets: ["latin"],
	variable: "--font-dancing-script",
});

export default async function layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				id="root"
				className={`${commissioner.className} ${dancingScript.variable} bg-surface-600 text-fg min-h-dvh`}
			>
        <RootLayout>
          { children }
        </RootLayout>
			</body>
		</html>
	);
}
