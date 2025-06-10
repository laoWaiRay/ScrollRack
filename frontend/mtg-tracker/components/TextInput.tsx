import { Input, Field, Label, Button } from "@headlessui/react";
import { ChangeEvent, MouseEvent } from "react";
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
}

export default function TextInput({
	label,
	name,
	value,
	onChange,
	placeholder,
	type,
	hidden,
  toggleHidden,
  errorMessage
}: TextInputProps) {
	function renderEyeIcon() {
    const iconStyle = `text-white absolute right-0 top-1/2 translate-y-[-57%] p-2`;

		if (type != "password" || toggleHidden == undefined) {
			return null;
		}

		switch (hidden) {
			case true:
				return (
          <ButtonIcon onClick={toggleHidden} styles={iconStyle}>
						<EyeSlash />
          </ButtonIcon>
				);
			case false:
				return (
          <ButtonIcon onClick={toggleHidden} styles={iconStyle}>
						<Eye />
          </ButtonIcon>
				);
			default:
				return null;
		}
	}
  
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

	return (
		<Field className="flex flex-col">
			<Label className="mb-1.5 text-fg">{label}</Label>
      <div className="max-w-xs">
        {errorMessage}
      </div>
			<div className="relative">
				<Input
					className={`w-full bg-surface-500 px-4 py-2 rounded-md text-fg-light mb-1.5 focus-outline pr-11`}
					name={name}
					type={getInputType()}
          autoComplete="new-password"
					placeholder={placeholder ?? ""}
					value={value}
					onChange={onChange}
				/>
				{renderEyeIcon()}
			</div>
		</Field>
	);
}
