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

interface ComboBoxInterface {
	list: string[];
	selected: string | null;
	setSelected: Dispatch<SetStateAction<string | null>>;
	query: string;
	setQuery: Dispatch<SetStateAction<string>>;
	inputStyle?: string;
  size?: "sm" | "md" | "lg"
}

// Expected Parent Usage:
// const [selected, setSelected] = useState<Person | null>(null);
// const [query, setQuery] = useState("");
export default function ComboBox({
	list,
	selected,
	setSelected,
	query,
	setQuery,
	inputStyle,
  size = "lg"
}: ComboBoxInterface) {
	const filteredList =
		query === ""
			? list
			: list.filter((listItem) => {
					return listItem.toLowerCase().includes(query.toLowerCase());
			  });

  const maxWidth = size === "sm"
        ? "max-w-sm"
        : size === "md"
          ? "max-w-md"
          : "max-w-lg";
        
	return (
		<Combobox
			value={selected!}
			onChange={(value) => setSelected(value ?? null)}
			onClose={() => setQuery("")}
		>
			<div className={`relative w-full shrink ${maxWidth}`}>
				<ComboboxInput
					className={`w-full bg-surface-600 border border-surface-500 px-4 py-2 rounded-md text-fg-light focus:outline ${inputStyle}`}
					displayValue={(item: string | null) => item ?? ""}
					onChange={(event) => setQuery(event.target.value)}
          placeholder="Search..."
				/>
				<ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
					<AngleDown className="size-4 fill-fg group-data-hover:fill-white" />
				</ComboboxButton>
			</div>

			<ComboboxOptions
				anchor={{ to: "bottom" }}
        modal={true}
				transition
				className={
					"w-(--input-width) flex flex-col rounded-lg border border-surface-500 bg-surface-600 [--anchor-gap:--spacing(1)] empty:invisible transition duration-100 ease-in data-leave:data-closed:opacity-0 !max-h-[min(30vh,24rem)] absolute top-full z-60"
				}
			>
				{filteredList
					.sort((a, b) => a.localeCompare(b))
					.map((listItem) => (
						<ComboboxOption
							key={listItem}
							value={listItem}
							className="group w-full border-b border-surface-500 px-4 py-2 text-fg-light focus-outline flex gap-2 items-center select-none data-focus:bg-white/5"
						>
							<Check className="invisible size-4 fill-white group-data-selected:visible" />
							<div className="text-base text-white">{listItem}</div>
						</ComboboxOption>
					))}
			</ComboboxOptions>
		</Combobox>
	);
}
