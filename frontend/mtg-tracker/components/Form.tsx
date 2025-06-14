import { ChangeEvent } from "react";
import TextInput from "./TextInput";
import { ValidationError } from "next/dist/compiled/amphtml-validator";
import { renderErrors } from "@/helpers/renderErrors";

export interface TextFormField {
	type: "text";
	name: string;
	label: string;
	value: string;
	errorMessages: ValidationError[] | undefined;
  disabled?: boolean;
  autoComplete?: "on" | "off";
}

export interface PasswordFormField {
	type: "password";
	name: string;
	label: string;
	value: string;
	errorMessages?: ValidationError[];
	hidden: boolean;
	toggleHidden: () => void;
  disabled?: boolean;
  autoComplete?: "on" | "off" | "new-password" | "current-password";
}

export type FormField = TextFormField | PasswordFormField;

interface FormInterface {
	fields: FormField[];
	handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function Form({ fields, handleChange }: FormInterface) {
	return fields.map((f) => {
		switch (f.type) {
			case "text":
				return (
					<TextInput
            key={f.name}
						name={f.name}
						label={f.label}
						value={f.value}
						onChange={(e) => handleChange(e)}
						errorMessage={f.errorMessages && renderErrors(f.errorMessages)}
            isDisabled={f.disabled ?? false}
					/>
				);
			case "password":
				return (
					<TextInput
            key={f.name}
						type="password"
						hidden={f.hidden}
						toggleHidden={f.toggleHidden}
						name={f.name}
						label={f.label}
						value={f.value}
						onChange={(e) => handleChange(e)}
						errorMessage={f.errorMessages && renderErrors(f.errorMessages)}
            isDisabled={f.disabled ?? false}
            autoComplete={f.autoComplete ?? "on"}
					/>
				);
			default:
				const _exhaustiveCheck: never = f;
				throw new Error(`Unhandled field type: ${JSON.stringify(f)}`);
		}
	});
}
