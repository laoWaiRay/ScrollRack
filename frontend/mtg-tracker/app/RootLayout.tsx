"use client"
import { AuthProvider } from "@/context/AuthContext";
import { UserWithEmailDTO } from "@/types/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import dynamic from "next/dynamic";
import { ReactNode } from "react";

const ToastDynamic = dynamic(() => import("@/components/ToastDynamic"), {
	ssr: false,
});

interface RootLayoutInterface {
	children: ReactNode;
  user: UserWithEmailDTO | null;
}

export default function RootLayout({ children, user }: RootLayoutInterface) {
	return (
		<>
			<ToastDynamic />
			<GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
				<AuthProvider initialUser={user}>{children}</AuthProvider>
			</GoogleOAuthProvider>
		</>
	);
}
