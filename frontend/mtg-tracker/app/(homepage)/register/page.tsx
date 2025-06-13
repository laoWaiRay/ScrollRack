"use client";
import styles from "../styles.module.css";
import TextInput from "@/components/TextInput";
import { Dispatch, SetStateAction, useState } from "react";
import GoogleLogo from "@/public/icons/google.svg";
import ButtonPrimary from "@/components/ButtonPrimary";
import Link from "next/link";
import { api } from "@/generated/client";
import { isAxiosError } from "axios";
import { BAD_REQUEST } from "@/constants/httpStatus";
import useForm from "@/hooks/useForm";
import {
	ValidationError,
	RegisterErrors as Errors,
	RegisterFormData as FormData,
	registerFormErrorFieldMap as errorFieldMap,
	requiredEmail,
	requiredUsername,
	requiredPassword,
	passwordMismatch,
} from "@/types/formValidation";
import { renderErrors } from "@/helpers/renderErrors";

const initialValues: FormData = {
	email: "",
	username: "",
	password: "",
	confirmPassword: "",
};

export default function RegisterPage() {
	const { values, errors, handleChange, handleSubmit } = useForm<
		FormData,
		Errors
	>(initialValues, validateForm);
	const [isPwHidden, setIsPwHidden] = useState(true);
	const [isConfirmPwHidden, setIsConfirmPwHidden] = useState(true);

	const { email, username, password, confirmPassword } = values;
	const emailErrorMessages = errors?.email && renderErrors(errors.email);
	const usernameErrorMessages =
		errors?.username && renderErrors(errors.username);
	const passwordErrorMessages =
		errors?.password && renderErrors(errors.password);
	const confirmPasswordErrorMessages =
		errors?.confirmPassword && renderErrors(errors.confirmPassword);
	const unknownErrorMessages = errors?.unknown && renderErrors(errors.unknown);

	return (
		<div className={`${styles.gridB}`}>
			<form
				onSubmit={(e) => handleSubmit(onSubmit, e)}
				className={`flex flex-col justify-center px-12 py-12`}
			>
				<h1 className="text-lg mb-4 text-fg-light font-semibold select-none">
					Create an account
				</h1>
				<div>{unknownErrorMessages}</div>
				<TextInput
					name="email"
					label="Email"
					value={email}
					onChange={(e) => handleChange(e)}
					errorMessage={emailErrorMessages}
				/>
				<TextInput
					name="username"
					label="Username"
					value={username}
					onChange={(e) => handleChange(e)}
					errorMessage={usernameErrorMessages}
				/>
				<TextInput
					type="password"
					hidden={isPwHidden}
					toggleHidden={() => setIsPwHidden(!isPwHidden)}
					name="password"
					label="Password"
					value={password}
					onChange={(e) => handleChange(e)}
					errorMessage={passwordErrorMessages}
				/>
				<TextInput
					type="password"
					hidden={isConfirmPwHidden}
					toggleHidden={() => setIsConfirmPwHidden(!isConfirmPwHidden)}
					name="confirmPassword"
					label="Confirm Password"
					value={confirmPassword}
					onChange={(e) => handleChange(e)}
					errorMessage={confirmPasswordErrorMessages}
				/>
				<ButtonPrimary onClick={() => {}} type="submit">
					Sign Up
				</ButtonPrimary>
				<div className="text-fg-dark flex justify-center items-center">
					<div className="bg-fg-dark h-[1px] grow mr-4 ml-1" />
					<span className="select-none">OR</span>
					<div className="bg-fg-dark h-[1px] grow ml-4 mr-1" />
				</div>
				<ButtonPrimary onClick={() => {}} style="google">
					<div className="flex items-center justify-center">
						Sign up with Google <GoogleLogo className="ml-2" />
					</div>
				</ButtonPrimary>

				<div className="flex justify-center items-center">
					Already have an account?{" "}
					<Link href="/login" className="link px-1">
						Log in
					</Link>
				</div>
			</form>
		</div>
	);
}

function validateForm(data: FormData) {
	const errors = new Errors();
	const { email, username, password, confirmPassword } = data;
	if (!email || !username || !password) {
		if (!email) {
			errors.email.push(requiredEmail);
		}
		if (!username) {
			errors.username.push(requiredUsername);
		}
		if (!password) {
			errors.password.push(requiredPassword);
		}
	}

	if (!confirmPassword || password !== confirmPassword) {
		errors.confirmPassword.push(passwordMismatch);
	}

	return errors;
}

async function onSubmit(
	data: FormData,
	_errors?: Partial<Errors>,
	_setErrors?: Dispatch<SetStateAction<Partial<Errors>>>
) {
	const { username, email, password } = data;
	try {
		await api.postApiUserregister({ userName: username, email, password });
	} catch (error) {
		if (isAxiosError(error) && error.response?.status == BAD_REQUEST) {
			if (
				error.response?.data != null &&
				isValidationErrorArray(error.response.data)
			) {
				const responseErrors = validationErrorArrayToErrors(
					error.response.data
				);
				if (_setErrors) {
					_setErrors({
						...(_errors || {}),
						...responseErrors,
					});
				}
			}
		} else {
			throw error;
		}
	}
}

function validationErrorArrayToErrors(errorArray: ValidationError[]) {
	const errors = new Errors();
	for (const validationError of errorArray) {
		if (validationError.code in errorFieldMap) {
			const errorField = errorFieldMap[validationError.code];
			switch (errorField) {
				case "email":
					errors.email.push(validationError);
					break;
				case "username":
					errors.username.push(validationError);
					break;
				case "password":
					errors.password.push(validationError);
					break;
				case "confirmPassword":
					errors.confirmPassword.push(validationError);
					break;
				default:
					errors.unknown.push(validationError);
					break;
			}
		} else {
			errors.unknown.push(validationError);
		}
	}
	return errors;
}

function isValidationErrorArray(data: unknown): data is ValidationError[] {
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
