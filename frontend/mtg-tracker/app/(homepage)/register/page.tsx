"use client";
import styles from "../styles.module.css";
import { Dispatch, SetStateAction, useState } from "react";
import GoogleLogo from "@/public/icons/google.svg";
import ButtonPrimary from "@/components/ButtonPrimary";
import Link from "next/link";
import { api } from "@/generated/client";
import { isAxiosError } from "axios";
import { BAD_REQUEST } from "@/constants/httpStatus";
import useForm from "@/hooks/useForm";
import {
	RegisterErrors as Errors,
	RegisterFormData as FormData,
	registerFormErrorFieldMap as errorFieldMap,
	requiredEmail,
	requiredUsername,
	requiredPassword,
	passwordMismatch,
} from "@/types/formValidation";
import { renderErrors } from "@/helpers/renderErrors";
import { Form, FormField } from "@/components/Form";
import { isValidationErrorArray, validationErrorArrayToErrors } from "@/helpers/validationHelpers";

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
	const unknownErrorMessages = errors?.unknown && renderErrors(errors.unknown);

	const formFields: FormField[] = [
		{
			type: "text",
			name: "email",
			label: "Email",
			value: email,
			errorMessages: errors?.email,
		},
		{
			type: "text",
			name: "username",
			label: "Username",
			value: username,
			errorMessages: errors?.username,
		},
		{
			type: "password",
			name: "password",
			label: "Password",
			value: password,
			errorMessages: errors?.password,
			hidden: isPwHidden,
			toggleHidden: () => setIsPwHidden(!isPwHidden),
		},
		{
			type: "password",
			name: "confirmPassword",
			label: "Confirm Password",
			value: confirmPassword,
			errorMessages: errors?.confirmPassword,
			hidden: isConfirmPwHidden,
			toggleHidden: () => setIsConfirmPwHidden(!isConfirmPwHidden),
		},
	];

	return (
		<div className={`${styles.gridB} z-20`}>
			<form
				onSubmit={(e) => handleSubmit(onSubmit, e)}
				className={`flex flex-col justify-center mx-0 xl:mx-12 lg:my-12`}
			>
				<h1 className="text-[1.4rem] lg:text-[1.5rem] mb-8 text-fg-light select-none font-light pt-6">
					Create an account
				</h1>
				<div>{unknownErrorMessages}</div>

				<Form fields={formFields} handleChange={handleChange} />

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

				<div className="flex justify-center items-center py-2">
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
				const responseErrors = validationErrorArrayToErrors<Errors>(
					error.response.data,
          errorFieldMap,
          Errors
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