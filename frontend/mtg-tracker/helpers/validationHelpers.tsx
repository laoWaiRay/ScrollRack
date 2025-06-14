import { ErrorFieldMap, ValidationError } from "@/types/formValidation";

export function isValidationErrorArray(data: unknown): data is ValidationError[] {
	return (
		Array.isArray(data) &&
		data.every(
			(item) =>
				typeof item == "object" &&
				item !== null &&
				"code" in item &&
				"description" in item &&
				typeof item.code == "string" &&
				typeof item.description == "string"
		)
	);
}

export function validationErrorArrayToErrors<ErrorsT extends Record<string, ValidationError[]>>(
	errorArray: ValidationError[],
	errorFieldMap: ErrorFieldMap<ErrorsT>,
	ErrorsCtor: new () => ErrorsT
) {
	const errors = new ErrorsCtor();
	for (const validationError of errorArray) {
		const key = errorFieldMap[validationError.code];

		if (key && key in errors) {
			errors[key].push(validationError);
		} else {
			errors.unknown.push(validationError);
		}
	}
	return errors;
}