import type { Metadata } from "next";
import { Commissioner, Dancing_Script } from "next/font/google";
import "./globals.css";
import { getUserWithEmail } from "@/actions/getUserWithEmail";
import RootLayout from "./RootLayout";
import { extractAuthResult } from "@/helpers/extractAuthResult";
import { UserWithEmailDTO } from "@/types/client";

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
	const authResult = await getUserWithEmail();
  let user: UserWithEmailDTO | null = null;
  try {
    user = extractAuthResult(authResult);
  } catch (error) {
  }

	return (
		<html lang="en">
			<body
				id="root"
				className={`${commissioner.className} ${dancingScript.variable} bg-surface-600 text-fg min-h-dvh`}
			>
        <RootLayout user={user}>
          { children }
        </RootLayout>
			</body>
		</html>
	);
}
