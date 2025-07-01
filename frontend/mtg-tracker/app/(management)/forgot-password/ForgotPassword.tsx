"use client";

import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import ButtonPrimary from "@/components/ButtonPrimary";
import TextInput from "@/components/TextInput";
import { api } from "@/generated/client";
import { ForgotPasswordRequestDTO } from "@/types/client";
import useToast from "@/hooks/useToast";
import {
	ForgotPasswordFormData as FormData,
	ForgotPasswordFormErrors as Errors,
	ForgotPasswordFormErrorFieldMap as errorFieldMap,
	requiredEmail,
} from "@/types/formValidation";
import useForm from "@/hooks/useForm";
import { handleAxiosErrors } from "@/helpers/validationHelpers";
import { BAD_REQUEST } from "@/constants/httpStatus";
import { renderErrors } from "@/helpers/renderErrors";

const initialValues: FormData = {
	email: "",
};

export default function ForgotPassword() {
	const router = useRouter();
	const { toast } = useToast();
	const { values, errors, handleChange, handleSubmit, isLoading } = useForm<
		FormData,
		Errors
	>(initialValues, validateForm);
	const { email } = values;

	async function onSubmit(
		_: FormData,
		_errors?: Partial<Errors>,
		_setErrors?: Dispatch<SetStateAction<Partial<Errors>>>
	) {
		try {
			const request: ForgotPasswordRequestDTO = {
				email,
			};
			await api.postApiUsersendPasswordReset(request);
			toast(`Sent password reset link to ${email}`, "success");
			if (_setErrors) {
				_setErrors({});
			}
		} catch (error) {
			handleAxiosErrors<Errors>(
				[BAD_REQUEST],
				error,
				errorFieldMap,
				Errors,
				_setErrors,
				_errors
			);
		}
	}

	const emailErrorMessages = errors?.email && renderErrors(errors.email);

	return (
		<div className="p-6 bg-gradient-hero w-full flex flex-col justify-center items-center min-h-screen">
			<div className="flex flex-col gap-4 max-w-md text-fg-light p-12 rounded-lg">
				<h2 className="text-lg">Forgot your password?</h2>
				<form action="" onSubmit={(e) => handleSubmit(onSubmit, e)}>
					<TextInput
						name="email"
						label="Email"
						value={email}
						onChange={handleChange}
						errorMessage={emailErrorMessages}
					/>
					<ButtonPrimary
						onClick={() => {}}
						uppercase={false}
						style="transparent"
						type="submit"
						disabled={isLoading}
						styles="mt-6 mb-0"
					>
						Send Password Reset
					</ButtonPrimary>
				</form>
				<div className="border-t border-surface-500">
					<ButtonPrimary
						onClick={() => router.push("/commandzone")}
						uppercase={false}
						style="transparent"
					>
						Back
					</ButtonPrimary>
				</div>
			</div>
		</div>
	);
}

function validateForm(data: FormData) {
	const errors = new Errors();
	const { email } = data;
	if (!email) {
		errors.email.push(requiredEmail);
	}
	return errors;
}
