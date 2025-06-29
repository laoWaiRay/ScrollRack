"use client";
import styles from "../styles.module.css";
import { Dispatch, SetStateAction, useState } from "react";
import GoogleLogo from "@/public/icons/google.svg";
import ButtonPrimary from "@/components/ButtonPrimary";
import Link from "next/link";
import { api } from "@/generated/client";
import { BAD_REQUEST, UNAUTHORIZED } from "@/constants/httpStatus";
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
import { handleAxiosErrors } from "@/helpers/validationHelpers";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ActionType } from "@/context/AuthContext";

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
  const { user, dispatch } = useAuth();

	const { email, username, password, confirmPassword } = values;
	const unknownErrorMessages = errors?.unknown && renderErrors(errors.unknown);
	const router = useRouter();
  const [isFetching, setIsFetching] = useState(false);

	async function onSubmit(
		data: FormData,
		_errors?: Partial<Errors>,
		_setErrors?: Dispatch<SetStateAction<Partial<Errors>>>
	) {
		const { username, email, password } = data;
		try {
      setIsFetching(true);
      dispatch({ type: ActionType.LOGOUT });
			const userDTO = await api.postApiUserregister({ userName: username, email, password }, { withCredentials: true });
      dispatch({ type: ActionType.LOGIN, payload: userDTO });
			router.push("/commandzone");
      setIsFetching(false);
		} catch (error) {
			handleAxiosErrors<Errors>(
				[UNAUTHORIZED, BAD_REQUEST],
				error,
				errorFieldMap,
				Errors,
				_setErrors,
				_errors
			);
      setIsFetching(false);
		}
	}

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
				className={`flex flex-col justify-center mx-0 xl:mx-12 lg:my-12 px-2`}
			>
				<h1 className="text-[1.4rem] lg:text-[1.5rem] mb-8 text-fg-light select-none font-light pt-6">
					Create an account
				</h1>
				<div>{unknownErrorMessages}</div>

				<Form fields={formFields} handleChange={handleChange} />

				<ButtonPrimary onClick={() => {}} type="submit" disabled={isFetching} uppercase={false}>
					Sign Up
				</ButtonPrimary>
				<div className="text-fg-dark flex justify-center items-center">
					<div className="bg-fg-dark h-[1px] grow mr-4 ml-1" />
					<span className="select-none">OR</span>
					<div className="bg-fg-dark h-[1px] grow ml-4 mr-1" />
				</div>
				<ButtonPrimary onClick={() => {}} style="google" disabled={isFetching} uppercase={false}>
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
