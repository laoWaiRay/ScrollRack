import { ErrorFieldMap, ValidationError } from "@/types/formValidation";
import { ServerApiError } from "@/types/server";
import { isAxiosError } from "axios";
import { Dispatch, SetStateAction } from "react";

export function isValidationErrorArray(
	data: unknown
): data is ValidationError[] {
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

export function validationErrorArrayToErrors<
	ErrorsT extends Record<string, ValidationError[]>
>(
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

export function handleServerApiError<
	ErrorsT extends Record<string, ValidationError[]>
>(
  expectedResponseStatuses: number[],
	error: unknown,
	errorFieldMap: ErrorFieldMap<ErrorsT>,
	ErrorsCtor: new () => ErrorsT,
  setErrors: Dispatch<SetStateAction<Partial<ErrorsT>>> | undefined,
  errors: Partial<ErrorsT> | undefined,
) {
	if (error instanceof ServerApiError) {
    console.log(error)
		const status = error.status;
		if (
			status &&
			expectedResponseStatuses.includes(status) &&
			isValidationErrorArray(error.data)
		) {
			const responseErrors = validationErrorArrayToErrors<ErrorsT>(
				error.data,
				errorFieldMap,
				ErrorsCtor
			);
			if (setErrors) {
				setErrors({
					...(errors || {}),
					...responseErrors,
				});
			}
		}
	} else {
		throw error;
	}
}
