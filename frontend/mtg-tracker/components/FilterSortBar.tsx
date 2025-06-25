import ButtonIcon from "./ButtonIcon";
import SearchBar from "./SearchBar";
import Sort from "@/public/icons/sort.svg";
import Filter from "@/public/icons/filter.svg";
import { Dispatch, SetStateAction } from "react";

interface FilterSortBarInterface {
	filter: string;
	setFilter: Dispatch<SetStateAction<string>>;
	onSortClick?: () => void;
	onFilterClick?: () => void;
	useSortButton?: boolean;
	useFilterButton?: boolean;
}

export default function FilterSortBar({
	filter,
	setFilter,
	onSortClick,
	onFilterClick,
	useSortButton = true,
	useFilterButton = true,
}: FilterSortBarInterface) {
	return (
		<section className="flex w-full mt-2 justify-between items-center gap-2 px-2 max-w-md">
			<SearchBar
				value={filter}
				onChange={(e) => setFilter(e.target.value)}
				onClick={() => setFilter("")}
			/>

			{useSortButton && (
				<ButtonIcon onClick={onSortClick}>
					<div className="w-[2.5em] border border-surface-500 rounded p-1">
						<Sort />
					</div>
				</ButtonIcon>
			)}
			{useFilterButton && (
				<ButtonIcon onClick={onFilterClick}>
					<div className="w-[2.5em] border border-surface-500 rounded p-2">
						<Filter />
					</div>
				</ButtonIcon>
			)}
		</section>
	);
}
