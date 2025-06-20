"use client";
import { useAuth } from "@/hooks/useAuth";
import { Dispatch, SetStateAction, useState } from "react";
import OptionsLayout from "@/components/OptionsLayout";
import useForm from "@/hooks/useForm";
import { Form, FormField } from "@/components/Form";
import {
	UserUpdateErrors as Errors,
	UserUpdateFormData as FormData,
	requiredEmail,
	requiredUsername,
	requiredPassword,
	passwordMismatch,
	updateUserErrorFieldMap as errorFieldMap,
} from "@/types/formValidation";
import { renderErrors } from "@/helpers/renderErrors";
import ButtonPrimary from "@/components/ButtonPrimary";
import Image from "next/image";
import { api } from "@/generated/client";
import { UserReadDTO, UserWriteDTO } from "@/types/client";
import { useRouter } from "next/navigation";
import { handleAxiosErrors } from "@/helpers/validationHelpers";
import { ActionType } from "@/context/AuthContext";
import useToast from "@/hooks/useToast";
import { BAD_REQUEST, UNAUTHORIZED } from "@/constants/httpStatus";

interface AccountInterface {

}

export default function Account({}: AccountInterface) {
	const { user, dispatch } = useAuth();
	const router = useRouter();
	const { toast } = useToast();

	const initialValues: FormData = {
		email: user?.email ?? "",
		username: user?.userName ?? "",
		password: "",
		newPassword: "",
		confirmNewPassword: "",
	};

	const { values, errors, handleChange, handleSubmit } = useForm<
		FormData,
		Errors
	>(initialValues, validateForm);
	const [isPwHidden, setIsPwHidden] = useState(true);
	const [isNewPwHidden, setIsNewPwHidden] = useState(true);
	const [isConfirmNewPwHidden, setIsConfirmNewPwHidden] = useState(true);

	const { email, username, password, newPassword, confirmNewPassword } = values;
	const unknownErrorMessages = errors?.unknown && renderErrors(errors.unknown);

	const formFields: FormField[] = [
		{
			type: "text",
			name: "email",
			label: "Email",
			value: email,
			errorMessages: errors?.email,
			disabled: true,
			autoComplete: "off",
		},
		{
			type: "text",
			name: "username",
			label: "Username",
			value: username,
			errorMessages: errors?.username,
			disabled: false,
			autoComplete: "off",
		},
		{
			type: "password",
			name: "password",
			label: "Current Password",
			value: password,
			errorMessages: errors?.password,
			hidden: isPwHidden,
			toggleHidden: () => setIsPwHidden(!isPwHidden),
			disabled: false,
			autoComplete: "current-password",
		},
		{
			type: "password",
			name: "newPassword",
			label: "New Password",
			value: newPassword,
			errorMessages: errors?.newPassword,
			hidden: isNewPwHidden,
			toggleHidden: () => setIsNewPwHidden(!isNewPwHidden),
			disabled: false,
		},
		{
			type: "password",
			name: "confirmNewPassword",
			label: "Confirm New Password",
			value: confirmNewPassword,
			errorMessages: errors?.confirmNewPassword,
			hidden: isConfirmNewPwHidden,
			toggleHidden: () => setIsConfirmNewPwHidden(!isConfirmNewPwHidden),
			disabled: false,
		},
	];

	async function onSubmit(
		data: FormData,
		_errors?: Partial<Errors>,
		_setErrors?: Dispatch<SetStateAction<Partial<Errors>>>
	) {
		if (user?.id == null) {
			return;
		}

		const { email, username, password, newPassword } = data;

		const userWriteDTO: UserWriteDTO = {
			id: user.id,
			email,
			userName: username,
			currentPassword: password,
			newPassword,
		};

		try {
			await api.putApiUserId(userWriteDTO, {
				params: { id: user.id },
				withCredentials: true,
			});

			const userReadDTO: UserReadDTO = {
				id: user.id,
				email,
				userName: username,
				profile: user.profile,
			};

			dispatch!({ type: ActionType.UPDATE, payload: userReadDTO });
			toast("Updated Profile", "success");
			router.push("/commandzone");
		} catch (error) {
			handleAxiosErrors<Errors>(
        [UNAUTHORIZED, BAD_REQUEST],
				error,
				errorFieldMap,
				Errors,
				_setErrors,
				_errors
			);
		}
	}

	return (
		<OptionsLayout title="Account">
			<h2 className="self-center">EDIT PROFILE</h2>

			<div className="flex justify-center mt-8 mb-4">
				<div className="w-[64px] h-[64px] rounded-full overflow-hidden">
					<Image
						className="h-full w-full object-cover"
						src={`${user?.profile ?? "/images/fblthp.jpeg"}`}
						height={64}
						width={64}
						alt="User avatar"
					/>
				</div>
			</div>

			<form
				className={`flex flex-col justify-center mx-0`}
				onSubmit={(e) => handleSubmit(onSubmit, e)}
			>
				<div>{unknownErrorMessages}</div>
				<Form fields={formFields} handleChange={handleChange} />
				<div className="flex justify-end items-center gap-6">
					<div>
						<ButtonPrimary onClick={() => router.back()} style="transparent" uppercase={false}>
							Cancel
						</ButtonPrimary>
					</div>
					<div>
						<ButtonPrimary onClick={() => {}} style="primary" type="submit" uppercase={false}>
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
	const { email, username, password, newPassword, confirmNewPassword } = data;
	if (!email) {
		errors.email.push(requiredEmail);
	}
	if (!username) {
		errors.username.push(requiredUsername);
	}

	if (password && !newPassword) {
		errors.newPassword.push(requiredPassword);
	}

	if (
		(newPassword || confirmNewPassword) &&
		newPassword !== confirmNewPassword
	) {
		errors.confirmNewPassword.push(passwordMismatch);
	}

	return errors;
}
