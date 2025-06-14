import { Input, Field, Label, Button } from "@headlessui/react";
import { ChangeEvent, MouseEvent, useEffect, useRef } from "react";
import Eye from "@/public/icons/eye.svg";
import EyeSlash from "@/public/icons/eye-slash.svg";
import ButtonIcon from "@/components/ButtonIcon";

interface TextInputProps {
	label: string;
	name: string;
	value: string;
	onChange: (event: ChangeEvent<HTMLInputElement>) => void;
	placeholder?: string;
	type?: "password" | "text";
	hidden?: boolean;
	toggleHidden?: (e: MouseEvent<HTMLButtonElement>) => void;
	errorMessage?: React.ReactNode;
	isDisabled?: boolean;
	autoComplete?: "on" | "off" | "new-password" | "current-password";
}

export default function TextInput({
	label,
	name,
	value = "",
	onChange,
	placeholder,
	type = "text",
	hidden = true,
	toggleHidden,
	errorMessage,
	isDisabled = false,
	autoComplete = "on",
}: TextInputProps) {
	const inputRef = useRef<HTMLInputElement>(null);

	const iconStyle = `text-white absolute right-0 top-1/2 translate-y-[-57%] p-2`;

	function getInputType() {
		switch (type) {
			case "password":
				if (hidden) {
					return "password";
				}
				return "text";
			default:
				return "text";
		}
	}

	useEffect(() => {
		const handle = setTimeout(() => {
			if (inputRef.current?.value !== value) {
				const event = {
					target: inputRef.current,
				} as ChangeEvent<HTMLInputElement>;
        onChange(event);
			}
		}, 100);
    
    return () => clearTimeout(handle);
	}, []);

	return (
		<Field className="flex flex-col mb-2" disabled={isDisabled}>
			<Label className="mb-2 text-fg">{label}</Label>
			<div className="max-w-xs">{errorMessage}</div>
			<div className="relative">
				<input
					ref={inputRef}
					className={`w-full bg-surface-500 px-4 py-2 rounded-md text-fg-light mb-1.5 focus-outline ${type === "password" && "pr-11"} ${
						isDisabled && "opacity-50"
					}`}
					name={name}
					type={getInputType()}
					autoComplete={autoComplete ?? "on"}
					placeholder={placeholder ?? ""}
					value={value ?? ""}
					onChange={onChange}
          disabled={isDisabled}
				/>

				<div className={`${type !== "password" && "hidden"}`}>
					<ButtonIcon
						onClick={toggleHidden}
						styles={iconStyle}
					>
						<div className={`${!hidden && "hidden"}`}>
							<Eye />
						</div>
						<div className={`${hidden && "hidden"}`}>
							<EyeSlash />
						</div>
					</ButtonIcon>
				</div>
			</div>
		</Field>
	);
}
