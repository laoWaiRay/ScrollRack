"use client"
import { AuthProvider } from "@/context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import dynamic from "next/dynamic";
import { ReactNode } from "react";

const ToastDynamic = dynamic(() => import("@/components/ToastDynamic"), {
	ssr: false,
});

interface RootLayoutInterface {
	children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutInterface) {
	return (
		<>
			<ToastDynamic />
			<GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
				<AuthProvider initialUser={null}>{children}</AuthProvider>
			</GoogleOAuthProvider>
		</>
	);
}
