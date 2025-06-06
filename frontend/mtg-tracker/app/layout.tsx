import type { Metadata } from "next";
import { Commissioner, Dancing_Script } from "next/font/google";
import "./globals.css";


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

export default function RootLayout({
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
        {children}
      </body>
    </html>
  );
}
