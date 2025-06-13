import ErrorDescription from "@/components/ErrorDescription";
import { ValidationError } from "@/types/formValidation";

export function renderErrors(errors: ValidationError[] | undefined) {
	return errors?.map((e) => (
		<ErrorDescription key={e.code} description={e.description} />
	));
}