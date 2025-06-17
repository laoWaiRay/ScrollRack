"use client";
import { Switch } from "@headlessui/react";
import { useState } from "react";
import ButtonPrimary from "@/components/ButtonPrimary";
import OptionsLayout from "@/components/OptionsLayout";

interface SettingsInterface {
}

export default function Settings({}: SettingsInterface) {
	const [enabled, setEnabled] = useState(false);

	return (
		<OptionsLayout title={"Settings"}>
			<h2 className="mb-6 self-center">DISPLAY</h2>
			<div className="flex justify-between px-2">
				<div>Dark Mode</div>
				<Switch
					checked={enabled}
					onChange={setEnabled}
					className="group inline-flex h-6 w-11 items-center rounded-full bg-surface-500 transition data-checked:bg-primary-300"
				>
					<span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
				</Switch>
			</div>
			<div className="aspect-3/2 self-end my-8">
				<ButtonPrimary onClick={() => {}} style="secondary">
					LOG OUT
				</ButtonPrimary>
			</div>
		</OptionsLayout>
	);
}
