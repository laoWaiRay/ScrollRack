import { useState } from "react";

export default function useForm<DataT, ErrorT = unknown>(
	initialValues: DataT,
	validate?: (values: DataT) => Partial<ErrorT>
) {
	const [values, setValues] = useState(initialValues);
	const [errors, setErrors] = useState<Partial<ErrorT>>({});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setValues((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (
		onSubmit: (
			values: DataT,
			_errors?: typeof errors,
			_setErrors?: typeof setErrors
		) => void | Promise<void>,
		e: React.FormEvent
	) => {
		e.preventDefault();

		const validationErrors = validate ? validate(values) : {};
		setErrors(validationErrors);
		if (
			validate &&
			(Object.values(validationErrors) as string[][]).some(
				(errorList) => errorList.length > 0
			)
		) {
			return;
		} else {
			await onSubmit(values, errors, setErrors);
		}
	};

	return { values, errors, handleChange, handleSubmit };
}
