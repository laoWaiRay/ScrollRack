"use client";
import {
	DashboardLayout,
	DashboardHeader,
	DashboardMain,
} from "@/components/Dashboard";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@headlessui/react";
import ArrowLeft from "@/public/icons/angle-left-b.svg";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface OptionsLayoutInterface {
	children: ReactNode;
  title: string;
}

export default function OptionsLayout({ children, title }: OptionsLayoutInterface) {
	const { user } = useAuth();
	const router = useRouter();

	return (
		<DashboardLayout>
			<DashboardHeader title={title} user={user} />
			{/* Back Button */}
			<div className="w-fit self-start flex sticky top-24 left-0 pt-4 lg:top-0 ml-10 max-w-sm z-50">
				<Button
					className="w-16 h-16 bg-surface-400 rounded-full p-3"
					onClick={() => router.back()}
				>
					<ArrowLeft className="text-fg-light -translate-x-0.5" />
				</Button>
			</div>
			<DashboardMain styles="!max-w-sm">
				<div className="dashboard-main-content-layout relative">
					<section className="w-full flex flex-col px-4 mx-4 mt-4">
						{children}
					</section>
				</div>
			</DashboardMain>
		</DashboardLayout>
	);
}
