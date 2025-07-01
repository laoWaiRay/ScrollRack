"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ButtonPrimary from "@/components/ButtonPrimary";
import TextInput from "@/components/TextInput";
import { api } from "@/generated/client";
import { ResetPasswordRequestDTO } from "@/types/client";
import useToast from "@/hooks/useToast";
import {
	ResetPasswordFormData as FormData,
	ResetPasswordFormErrors as Errors,
	ResetPasswordFormErrorFieldMap as errorFieldMap,
	requiredPassword,
	passwordMismatch,
} from "@/types/formValidation";
import useForm from "@/hooks/useForm";
import { handleAxiosErrors } from "@/helpers/validationHelpers";
import { BAD_REQUEST, NOT_FOUND } from "@/constants/httpStatus";
import { renderErrors } from "@/helpers/renderErrors";
import { isAxiosError } from "axios";

const initialValues: FormData = {
	password: "",
	confirmPassword: "",
};

export default function ResetPassword() {
	const router = useRouter();
	const { toast } = useToast();
	const { values, errors, handleChange, handleSubmit, isLoading } = useForm<
		FormData,
		Errors
	>(initialValues, validateForm);
	const [tokenError, setTokenError] = useState<string | null>(null);
	const { password, confirmPassword } = values;
	const [isPwHidden, setIsPwHidden] = useState(true);
	const [isConfirmPwHidden, setIsConfirmPwHidden] = useState(true);
	const searchParams = useSearchParams();

	async function onSubmit(
		_: FormData,
		_errors?: Partial<Errors>,
		_setErrors?: Dispatch<SetStateAction<Partial<Errors>>>
	) {
		try {
			const id = searchParams.get("id");
			const token = searchParams.get("token");

			if (!id || !token) {
				setTokenError("Invalid or expired reset token");
				return;
			}

			const request: ResetPasswordRequestDTO = {
				id,
				password,
				token,
			};
			await api.postApiUserresetPassword(request);
      router.push("/login");
			toast(`Successfully reset password`, "success");
			if (_setErrors) {
				_setErrors({});
			}
		} catch (error) {
			if (isAxiosError(error) && typeof error.response?.data === "string") {
				setTokenError("Invalid or expired reset token");
			}

			handleAxiosErrors<Errors>(
				[BAD_REQUEST, NOT_FOUND],
				error,
				errorFieldMap,
				Errors,
				_setErrors,
				_errors
			);
		}
	}

  const unknownErrorMessage = errors?.unknown && renderErrors(errors.unknown);
	const passwordErrorMessages =
		errors?.password && renderErrors(errors.password);
	const confirmPasswordErrorMessages =
		errors?.confirmPassword && renderErrors(errors.confirmPassword);

	return (
		<div className="p-6 bg-gradient-hero w-full flex flex-col justify-center items-center min-h-screen">
			<div className="flex flex-col gap-4 max-w-md text-fg-light p-12 rounded-lg">
				{tokenError || unknownErrorMessage ? (
					<div className="p-12">Invalid or expired reset token</div>
				) : (
					<>
						<h2 className="text-lg">Reset your password</h2>
						<form action="" onSubmit={(e) => handleSubmit(onSubmit, e)}>
							<TextInput
								name="password"
								label="New Password"
								value={password}
								onChange={handleChange}
								errorMessage={passwordErrorMessages}
                type="password"
                hidden={isPwHidden}
                toggleHidden={() => setIsPwHidden(!isPwHidden)}
							/>
							<TextInput
								name="confirmPassword"
								label="Confirm New Password"
								value={confirmPassword}
								onChange={handleChange}
								errorMessage={confirmPasswordErrorMessages}
                type="password"
                hidden={isConfirmPwHidden}
                toggleHidden={() => setIsConfirmPwHidden(!isConfirmPwHidden)}
							/>
							<ButtonPrimary
								onClick={() => {}}
								uppercase={false}
								style="transparent"
								styles="mt-6 mb-0"
								type="submit"
								disabled={isLoading}
							>
								Reset Password
							</ButtonPrimary>
						</form>
					</>
				)}
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
	const { password, confirmPassword } = data;

	if (!password) {
		errors.password.push(requiredPassword);
	}

	if (!confirmPassword || password !== confirmPassword) {
		errors.confirmPassword.push(passwordMismatch);
	}

	return errors;
}
