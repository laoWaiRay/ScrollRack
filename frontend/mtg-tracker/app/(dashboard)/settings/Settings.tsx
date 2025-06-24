"use client";
import { useState } from "react";
import ButtonPrimary from "@/components/ButtonPrimary";
import OptionsLayout from "@/components/OptionsLayout";
import Switch from "@/components/Switch";

interface SettingsInterface {
}

export default function Settings({}: SettingsInterface) {
	const [enabled, setEnabled] = useState(false);

	return (
		<OptionsLayout title={"Settings"}>
			<h2 className="mb-6 self-center">DISPLAY</h2>
			<div className="flex justify-between px-2">
				<div>Dark Mode</div>
        <Switch enabled={enabled} setEnabled={setEnabled} />
			</div>
			<div className="aspect-3/2 self-end my-8">
				<ButtonPrimary onClick={() => {}} style="secondary" uppercase={false}>
					Log Out
				</ButtonPrimary>
			</div>
		</OptionsLayout>
	);
}
