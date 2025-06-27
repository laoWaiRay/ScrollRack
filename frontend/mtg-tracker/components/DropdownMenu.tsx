import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { Dispatch, SetStateAction } from "react";
import AngleDown from "@/public/icons/angle-down.svg";

interface DropdownMenuInterface<OptionT extends string> {
	options: OptionT[];
	selected: OptionT;
	setSelected: Dispatch<SetStateAction<OptionT>>;
}

export default function DropdownMenu<OptionT extends string>({
	options,
	selected,
	setSelected,
}: DropdownMenuInterface<OptionT>) {
	return (
		<Menu>
			<MenuButton className="border border-surface-500 px-2.5 py-1 rounded-lg">
				<div className="flex gap-1 items-center">
					<span>{selected}</span>
					<AngleDown className="size-4 fill-fg group-hover:fill-white" />
				</div>
			</MenuButton>
			<MenuItems
				anchor="bottom"
				className="bg-surface-600 border border-surface-500 rounded mt-2 min-w-(--button-width)"
			>
				{options.map((option) => (
					<MenuItem key={option}>
						<div
							className="px-2.5 py-2 select-none data-focus:bg-white/5 border-b border-surface-500/50"
							onClick={() => setSelected(option)}
						>
							<span>{option}</span>
						</div>
					</MenuItem>
				))}
			</MenuItems>
		</Menu>
	);
}
