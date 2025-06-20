import { Field, Input } from "@headlessui/react";
import Search from "@/public/icons/search.svg";
import Close from "@/public/icons/close.svg";
import ButtonIcon from "./ButtonIcon";
import { ChangeEventHandler, MouseEventHandler } from "react";

interface SearchBarInterface {
	value: string;
	onChange: ChangeEventHandler<HTMLInputElement>;
  onClick: MouseEventHandler;
}

export default function SearchBar({ value, onChange, onClick }: SearchBarInterface) {
	return (
		<Field className="relative w-full">
			<Input
				className="border border-surface-400 w-full px-4 py-2 rounded-md"
				placeholder="Commander Name"
				value={value}
				onChange={onChange}
			/>
			{value ? (
				<ButtonIcon styles="size-[2em] absolute right-2 top-1/2 -translate-y-1/2 text-fg" onClick={onClick}>
					<Close />
				</ButtonIcon>
			) : (
				<div className="size-[2em] absolute right-2 top-1/2 -translate-y-1/2 text-surface-300">
					<Search />
				</div>
			)}
		</Field>
	);
}
