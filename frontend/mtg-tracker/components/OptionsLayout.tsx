"use client";
import {
	DashboardLayout,
	DashboardHeader,
	DashboardMain,
} from "@/components/Dashboard";
import { useAuth } from "@/hooks/useAuth";
import { Button, Switch } from "@headlessui/react";
import ArrowLeft from "@/public/icons/angle-left-b.svg";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface OptionsLayoutInterface {
  children: ReactNode;
}

export default function OptionsLayout({ children }: OptionsLayoutInterface) {
	const { user } = useAuth();
  const router = useRouter();

	return (
		<DashboardLayout styles="relative">
			<DashboardHeader title="Settings" user={user} />
			{/* Back Button */}
			<div className="w-full flex sticky top-24 left-0 pt-4 lg:top-0 lg:relative max-w-lg ml-14 lg:max-w-md">
				<Button className="w-16 h-16 bg-surface-400 rounded-full p-3" onClick={() => router.back()}>
					<ArrowLeft className="text-fg-light -translate-x-0.5" />
				</Button>
			</div>
			<DashboardMain styles="!max-w-lg">
				<div className="dashboard-main-content-layout relative">
          { children }
				</div>
			</DashboardMain>
		</DashboardLayout>
	);
}