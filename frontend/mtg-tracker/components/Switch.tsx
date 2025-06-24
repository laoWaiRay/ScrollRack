import { Switch as HeadlessUiSwitch } from "@headlessui/react";
import { Dispatch, SetStateAction } from "react";

interface SwitchInterface {
  enabled: boolean;
  setEnabled: Dispatch<SetStateAction<boolean>>;
}

export default function Switch({ enabled, setEnabled }: SwitchInterface) {
	return (
		<HeadlessUiSwitch
			checked={enabled}
			onChange={setEnabled}
			className="group inline-flex h-6 w-11 items-center rounded-full bg-surface-500 transition data-checked:bg-primary-300"
		>
			<span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
		</HeadlessUiSwitch>
	);
}
