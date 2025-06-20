import {
	Listbox,
	ListboxButton,
	ListboxOptions,
	ListboxOption,
} from "@headlessui/react";
import { Dispatch, SetStateAction } from "react";
import AngleDown from "@/public/icons/angle-down.svg";

interface ListBoxInterface {
	list: string[];
	selected: string | null;
	setSelected: Dispatch<SetStateAction<string | null>>;
}

export default function ListBox({
	list,
	selected,
	setSelected,
}: ListBoxInterface) {
	return (
		<Listbox value={selected} onChange={setSelected}>
			<div className="w-full relative group">
				<ListboxButton className="w-full bg-surface-500 px-4 py-2 rounded-md text-fg-light">
					{selected ?? <span className="text-fg-dark">Select commander</span>}
				</ListboxButton>
        <div className="absolute inset-y-0 right-0 px-2.5 flex flex-col justify-center pointer-events-none">
					<AngleDown className="size-4 fill-fg group-hover:fill-white" />
        </div>
			</div>
			<ListboxOptions
				anchor="bottom"
				className="w-(--button-width) flex flex-col gap-1 rounded-lg border border-white/5 bg-surface-500 [--anchor-gap:--spacing(1)] empty:invisible transition duration-100 ease-in data-leave:data-closed:opacity-0 !max-h-[min(30vh,24rem)] absolute top-full z-60"
			>
				{list.map((item) => (
					<ListboxOption
						key={item}
						value={item}
						className="group w-full bg-white/[2%] px-4 py-2 rounded-md text-fg-light focus-outline flex gap-2 items-center select-none data-focus:bg-white/20"
					>
						{item}
					</ListboxOption>
				))}
			</ListboxOptions>
		</Listbox>
	);
}
