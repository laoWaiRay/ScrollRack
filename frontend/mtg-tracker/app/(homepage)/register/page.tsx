"use client";
import styles from "../styles.module.css";
import TextInput from "@/components/TextInput";
import { ReactNode, useState } from "react";
import GoogleLogo from "@/public/icons/google.svg";
import ButtonPrimary from "@/components/ButtonPrimary";
import Link from "next/link";
import { api } from "@/generated/client";
import { isAxiosError } from "axios";
import ErrorDescription from "@/components/ErrorDescription";

interface FormData {
	email: string;
	username: string;
	password: string;
	confirmPassword: string;
}

interface ValidationError {
	code: string;
	description: string;
}

class Errors {
	constructor(
		public email: ValidationError[] = [],
		public username: ValidationError[] = [],
		public password: ValidationError[] = [],
		public confirmPassword: ValidationError[] = [],
		public unknown: ValidationError[] = []
	) {}
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

const errorFieldMap: Record<string, keyof FormData> = {
	InvalidEmail: "email",
	DuplicateEmail: "email",
	RequiredEmail: "email",

	InvalidUserName: "username",
	DuplicateUserName: "username",
	RequiredUsername: "username",

	PasswordTooShort: "password",
	PasswordRequiresDigit: "password",
	PasswordRequiresLower: "password",
	PasswordRequiresUpper: "password",
	PasswordRequiresNonAlphanumeric: "password",
	PasswordRequiresUniqueChars: "password",
	RequiredPassword: "password",

	PasswordMismatch: "confirmPassword",
	RequiredConfirmPassword: "confirmPassword",
};

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

const passwordMismatch: ValidationError = {
	code: "PasswordMismatch",
	description: "Passwords must match",
};

const requiredEmail: ValidationError = {
	code: "RequiredEmail",
	description: "Email is required",
};
const requiredUsername: ValidationError = {
	code: "RequiredUsername",
	description: "Username is required",
};
const requiredPassword: ValidationError = {
	code: "RequiredPassword",
	description: "Password is required",
};
const requiredConfirmPassword: ValidationError = {
	code: "RequiredConfirmPassword",
	description: "Confirm Password is required",
};

export default function RegisterPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [username, setUsername] = useState("");
	const [isPwHidden, setIsPwHidden] = useState(true);
	const [isConfirmPwHidden, setIsConfirmPwHidden] = useState(true);
	const [errors, setErrors] = useState<Errors | null>(null);

	async function handleRegister(e: React.SyntheticEvent) {
		e.preventDefault();
		let validationErrors = new Errors();

		if (!email || !username || !password) {
			if (!email) {
				validationErrors.email.push(requiredEmail);
			}
			if (!username) {
				validationErrors.username.push(requiredUsername);
			}
			if (!password) {
				validationErrors.password.push(requiredPassword);
			}
		}

		if (!confirmPassword || password !== confirmPassword) {
			validationErrors.confirmPassword.push(passwordMismatch);
		}
    
    if (validationErrors && !(Object.values(validationErrors).every(arr => arr.length == 0))) {
      setErrors(validationErrors);
      return;
    }

		try {
			await api.postApiUserregister({ userName: username, email, password });
			setErrors(null);
		} catch (error) {
			if (isAxiosError(error) && error.response?.status == 400) {
				if (
					error.response?.data != null &&
					isValidationErrorArray(error.response.data)
				) {
					const errors = validationErrorArrayToErrors(error.response.data);
					validationErrors = { ...validationErrors, ...errors };
				}

				if (validationErrors) {
					setErrors(validationErrors);
				}
			} else {
				throw error;
			}
		}
	}

	function renderErrors(errors: ValidationError[] | undefined) {
		return errors?.map((e) => (
			<ErrorDescription _key={e.code} description={e.description} />
		));
	}

	const emailErrorMessages = errors?.email && renderErrors(errors.email);
	const usernameErrorMessages =
		errors?.username && renderErrors(errors.username);
	const passwordErrorMessages =
		errors?.password && renderErrors(errors.password);
	const confirmPasswordErrorMessages =
		errors?.confirmPassword && renderErrors(errors.confirmPassword);
	const unknownErrorMessages = errors?.unknown && renderErrors(errors.unknown);

	return (
		<div
			className={`${styles.gridB} flex flex-col justify-center items-start mx-12`}
		>
			<form
				onSubmit={() => console.log("submit")}
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
					onChange={(e) => setEmail(e.target.value)}
					errorMessage={emailErrorMessages}
				/>
				<TextInput
					name="username"
					label="Username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					errorMessage={usernameErrorMessages}
				/>
				<TextInput
					type="password"
					hidden={isPwHidden}
					toggleHidden={() => setIsPwHidden(!isPwHidden)}
					name="password"
					label="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					errorMessage={passwordErrorMessages}
				/>
				<TextInput
					type="password"
					hidden={isConfirmPwHidden}
					toggleHidden={() => setIsConfirmPwHidden(!isConfirmPwHidden)}
					name="confirmPassword"
					label="Confirm Password"
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
					errorMessage={confirmPasswordErrorMessages}
				/>
				<ButtonPrimary onClick={handleRegister} type="submit">
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
