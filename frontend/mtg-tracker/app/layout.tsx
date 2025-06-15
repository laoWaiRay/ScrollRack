import type { Metadata } from "next";
import { Commissioner, Dancing_Script } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { verifySession } from "@/actions/verifySession";
import { ToastContainer, Slide } from "react-toastify";


export const metadata: Metadata = {
  title: "ScrollRack",
  description: "The Commander game tracker",
};

const commissioner = Commissioner({
  subsets: ['latin']
});

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing-script'
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await verifySession();

  return (
    <html lang="en">
      <body
        id="root"
        className={`${commissioner.className} ${dancingScript.variable} bg-surface-600 text-fg min-h-dvh`}
      >
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

        <AuthProvider initialUser={user}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
