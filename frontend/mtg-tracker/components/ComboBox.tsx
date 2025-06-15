"use client";
import {
	Combobox,
	ComboboxButton,
	ComboboxInput,
	ComboboxOption,
	ComboboxOptions,
} from "@headlessui/react";
import { Dispatch, SetStateAction } from "react";
import AngleDown from "@/public/icons/angle-down.svg";
import Check from "@/public/icons/check.svg";

interface ComboBoxInterface<SelectT extends { id: string; userName: string }> {
	list: SelectT[];
	selected: SelectT | null;
	setSelected: Dispatch<SetStateAction<SelectT | null>>;
	query: string;
	setQuery: Dispatch<SetStateAction<string>>;
}

// Expected Parent Usage:
// const [selected, setSelected] = useState<Person | null>(null);
// const [query, setQuery] = useState("");
export default function ComboBox<
	SelectT extends { id: string; userName: string }
>({
	list,
	selected,
	setSelected,
	query,
	setQuery,
}: ComboBoxInterface<SelectT>) {
	const filteredList =
		query === ""
			? list
			: list.filter((listItem) => {
					return listItem.userName.toLowerCase().includes(query.toLowerCase());
			  });

	return (
		<Combobox<SelectT>
			value={selected!}
			onChange={(value) => setSelected(value ?? null)}
			onClose={() => setQuery("")}
		>
			<div className="relative">
				<ComboboxInput
					className={
						"w-full bg-surface-500 px-4 py-2 rounded-md text-fg-light mb-1.5 focus-outline"
					}
					displayValue={(person: SelectT | null) => person?.userName ?? ""}
					onChange={(event) => setQuery(event.target.value)}
				/>
				<ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
					<AngleDown className="size-4 fill-white/60 group-data-hover:fill-white" />
				</ComboboxButton>
			</div>

			<ComboboxOptions
				anchor="bottom"
				transition
				className={
					"w-(--input-width) rounded-xl border border-white/5 bg-white/5 p-1 [--anchor-gap:--spacing(1)] empty:invisible transition duration-100 ease-in data-leave:data-closed:opacity-0 !max-h-96"
				}
			>
				{list.map((listItem) => (
					<ComboboxOption
						key={listItem.id}
						value={listItem}
						className="group w-full bg-surface-500 px-4 py-2 rounded-md text-fg-light focus-outline flex gap-2 my-1 items-center select-none data-focus:bg-white/10"
					>
						<Check className="invisible size-4 fill-white group-data-selected:visible" />
						<div className="text-base text-white">{listItem.userName}</div>
					</ComboboxOption>
				))}
			</ComboboxOptions>
		</Combobox>
	);
}
