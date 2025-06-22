import ButtonIcon from "./ButtonIcon";
import SearchBar from "./SearchBar";
import Sort from "@/public/icons/sort.svg";
import Filter from "@/public/icons/filter.svg";
import { Dispatch, SetStateAction } from "react";

interface FilterSortBarInterface {
  filter: string; 
  setFilter: Dispatch<SetStateAction<string>>;
}

export default function FilterSortBar({ filter, setFilter }: FilterSortBarInterface) {
	return (
		<section className="flex w-full mt-2 justify-between items-center gap-2 px-2 max-w-md">
			<SearchBar
				value={filter}
				onChange={(e) => setFilter(e.target.value)}
				onClick={() => setFilter("")}
			/>

			<ButtonIcon>
				<div className="w-[2.5em] border border-surface-500 rounded p-1">
					<Sort />
				</div>
			</ButtonIcon>
			<ButtonIcon>
				<div className="w-[2.5em] border border-surface-500 rounded p-2">
					<Filter />
				</div>
			</ButtonIcon>
		</section>
	);
}
