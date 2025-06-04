import { Input, Field, Label } from "@headlessui/react";

interface TextInputProps {
	label: string;
	name: string;
	value: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	placeholder?: string;
  type?: 'password' | 'text';
}

export default function TextInput({
	label,
	name,
	value,
	onChange,
	placeholder,
  type
}: TextInputProps) {
	return (
		<Field className="flex flex-col">
			<Label className="my-1.5 text-fg-light">{label}</Label>
			<Input
				className="bg-surface-500 px-4 py-2 rounded-md text-fg-light"
				name={name}
				type={type ?? 'text'}
				placeholder={placeholder ?? ''}
        value={value}
        onChange={onChange}
			/>
		</Field>
	);
}
