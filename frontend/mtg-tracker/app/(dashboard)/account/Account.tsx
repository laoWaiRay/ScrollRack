"use client";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import OptionsLayout from "@/components/OptionsLayout";
import useForm from "@/hooks/useForm";
import { Form, FormField } from "@/components/Form";
import {
	RegisterErrors as Errors,
	RegisterFormData as FormData,
	requiredEmail,
	requiredUsername,
	requiredPassword,
	passwordMismatch,
} from "@/types/formValidation";
import { renderErrors } from "@/helpers/renderErrors";
import ButtonPrimary from "@/components/ButtonPrimary";

const initialValues: FormData = {
	email: "",
	username: "",
	password: "",
	confirmPassword: "",
};

export default function Account() {
	const { user } = useAuth();
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
      disabled: false,
		},
		{
			type: "text",
			name: "username",
			label: "Username",
			value: username,
			errorMessages: errors?.username,
      disabled: false,
		},
		{
			type: "password",
			name: "password",
			label: "Password",
			value: password,
			errorMessages: errors?.password,
			hidden: isPwHidden,
			toggleHidden: () => setIsPwHidden(!isPwHidden),
      disabled: false,
      autoComplete: "current-password"
		},
		{
			type: "password",
			name: "confirmPassword",
			label: "Confirm New Password",
			value: confirmPassword,
			errorMessages: errors?.confirmPassword,
			hidden: isConfirmPwHidden,
			toggleHidden: () => setIsConfirmPwHidden(!isConfirmPwHidden),
      disabled: false,
		},
	];
  
  const passwordField = formFields.find(f => f.name === "password");
  const confirmPwField = formFields.find(f => f.name === "confirmPassword");
  if (passwordField != null && confirmPwField != null) {
    confirmPwField.disabled = passwordField.value === "";
  }

	return (
		<OptionsLayout title="Account">
			<h2 className="mt-6 self-center">EDIT PROFILE</h2>

			<form
				className={`flex flex-col justify-center mx-0 lg:my-8`}
				onSubmit={() => {}}
			>
				<Form fields={formFields} handleChange={handleChange} />
				<div className="flex justify-end items-center gap-6">
					<div>
						<ButtonPrimary onClick={() => {}} style="transparent">
              Cancel
						</ButtonPrimary>
					</div>
					<div>
						<ButtonPrimary onClick={() => {}} style="primary">
              Save Profile
						</ButtonPrimary>
					</div>
				</div>
			</form>
		</OptionsLayout>
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
