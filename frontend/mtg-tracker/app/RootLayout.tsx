"use client"
import { AuthProvider } from "@/context/AuthContext";
import { UserReadDTO } from "@/types/client";
import { ReactNode } from "react";
import { Slide, ToastContainer } from "react-toastify";

interface RootLayoutInterface {
  children: ReactNode;
  user: UserReadDTO | null;
}

export default function RootLayout({ children, user }: RootLayoutInterface) {
	return (
		<>
			<ToastContainer
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
				transition={Slide}
			/>
			<AuthProvider initialUser={user}>{children}</AuthProvider>
		</>
	);
}
