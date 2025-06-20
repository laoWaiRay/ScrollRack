"use client";
import {
	Combobox,
	ComboboxButton,
	ComboboxInput,
	ComboboxOption,
	ComboboxOptions,
} from "@headlessui/react";
import { Dispatch, SetStateAction, useRef } from "react";
import AngleDown from "@/public/icons/angle-down.svg";
import Check from "@/public/icons/check.svg";

interface ComboBoxInterface {
	list: string[];
	selected: string | null;
	setSelected: Dispatch<SetStateAction<string | null>>;
	query: string;
	setQuery: Dispatch<SetStateAction<string>>;
	inputStyle?: string;
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
}: ComboBoxInterface) {
	const comboBoxRef = useRef<HTMLDivElement | null>(null);

	const filteredList =
		query === ""
			? list
			: list.filter((listItem) => {
					return listItem.toLowerCase().includes(query.toLowerCase());
			  });
  
function handleClick() {
  if (comboBoxRef.current && window.innerWidth <= 768) {
    comboBoxRef.current.scrollIntoView({behavior: "smooth", "block": "nearest"})
  }
}

	return (
		<Combobox
			value={selected!}
			onChange={(value) => setSelected(value ?? null)}
			onClose={() => setQuery("")}
		>
			<div className="relative w-full" ref={comboBoxRef} onClick={handleClick}>
				<ComboboxInput
					className={`w-full bg-surface-500 px-4 py-2 rounded-md text-fg-light focus:outline ${inputStyle}`}
					displayValue={(item: string | null) => item ?? ""}
					onChange={(event) => setQuery(event.target.value)}
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
					"w-(--input-width) flex flex-col gap-1 rounded-lg border border-white/5 bg-surface-500 [--anchor-gap:--spacing(1)] empty:invisible transition duration-100 ease-in data-leave:data-closed:opacity-0 !max-h-[min(30vh,24rem)] absolute top-full z-60"
				}
			>
				{filteredList
					.sort((a, b) => a.localeCompare(b))
					.map((listItem) => (
						<ComboboxOption
							key={listItem}
							value={listItem}
							className="group w-full bg-white/[2%] px-4 py-2 rounded-md text-fg-light focus-outline flex gap-2 items-center select-none data-focus:bg-white/20"
						>
							<Check className="invisible size-4 fill-white group-data-selected:visible" />
							<div className="text-base text-white">{listItem}</div>
						</ComboboxOption>
					))}
			</ComboboxOptions>
		</Combobox>
	);
}
