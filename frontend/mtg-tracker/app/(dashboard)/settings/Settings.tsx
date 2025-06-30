"use client";
import { useState } from "react";
import ButtonPrimary from "@/components/ButtonPrimary";
import OptionsLayout from "@/components/OptionsLayout";
import Switch from "@/components/Switch";
import ButtonLink from "@/components/ButtonLink";
import { api } from "@/generated/client";
import { useRouter } from "next/navigation";

interface SettingsInterface {}

export default function Settings({}: SettingsInterface) {
	const [enabled, setEnabled] = useState(false);
	const router = useRouter();

	async function handleLogout() {
		try {
			await api.postApiUserlogout({}, { withCredentials: true });
			router.push("login");
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<OptionsLayout title={"Settings"}>
			<section className="flex flex-col w-full gap-8 px-4">
				<div className="flex flex-col w-full gap-6">
					<h2 className="self-center">DISPLAY</h2>
					<div className="flex justify-between">
						<div>Dark Mode (not implemented yet)</div>
						<Switch enabled={enabled} setEnabled={setEnabled} />
					</div>
				</div>

				<div className="flex flex-col w-full gap-6">
					<h2 className="self-center">IMPORT GAMES</h2>
					<ButtonLink
						href="/import"
						style="transparent"
						styles="border border-surface-500 rounded-lg text-center"
						uppercase={false}
					>
						Import
					</ButtonLink>
				</div>

				<div className="aspect-3/2 self-end">
					<ButtonPrimary
						onClick={handleLogout}
						style="secondary"
						uppercase={false}
					>
						Log Out
					</ButtonPrimary>
				</div>
			</section>
		</OptionsLayout>
	);
}
