"use client"
import { AuthProvider } from "@/context/AuthContext";
import { UserWithEmailDTO } from "@/types/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import dynamic from "next/dynamic";
import { ReactNode } from "react";

const ToastDynamic = dynamic(
	async () => {
		const mod = await import("react-toastify");
		return {
			default: () => (
				<mod.ToastContainer
					position="top-left"
					autoClose={5000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick={false}
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
					theme="dark"
					transition={mod.Slide}
				/>
			),
		};
	},
	{ ssr: false }
);

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
