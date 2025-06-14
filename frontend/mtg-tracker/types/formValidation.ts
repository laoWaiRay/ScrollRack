export interface ValidationError {
	code: string;
	description: string;
}

export type ErrorFieldMap<ErrorsT> = Record<string, keyof ErrorsT>

// -------------------------------------------------------------------------------------------------
// Register Form
// -------------------------------------------------------------------------------------------------

export interface RegisterFormData {
	email: string;
	username: string;
	password: string;
	confirmPassword: string;
}

export class RegisterErrors {
	[key: string]: ValidationError[];

	constructor(
		public email: ValidationError[] = [],
		public username: ValidationError[] = [],
		public password: ValidationError[] = [],
		public confirmPassword: ValidationError[] = [],
		public unknown: ValidationError[] = []
	) {}
}

export const registerFormErrorFieldMap: ErrorFieldMap<RegisterErrors> =
	{
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

// -------------------------------------------------------------------------------------------------
// Login Form
// -------------------------------------------------------------------------------------------------

export interface LoginFormData {
	email: string;
	password: string;
}

export class LoginErrors {
	constructor(
		public invalidUsernameOrPassword: ValidationError[] = [],
		public email: ValidationError[] = [],
		public password: ValidationError[] = [],
		public unknown: ValidationError[] = []
	) {}
}

// -------------------------------------------------------------------------------------------------
// Update User Form
// -------------------------------------------------------------------------------------------------
export interface UserUpdateFormData {
	email: string;
	username: string;
	password: string;
  newPassword: string;
	confirmNewPassword: string;
}

export class UserUpdateErrors {
	[key: string]: ValidationError[];

	constructor(
		public email: ValidationError[] = [],
		public username: ValidationError[] = [],
		public password: ValidationError[] = [],
		public newPassword: ValidationError[] = [],
		public confirmNewPassword: ValidationError[] = [],
		public unknown: ValidationError[] = []
	) {}
}

export const updateUserErrorFieldMap: ErrorFieldMap<UserUpdateErrors> =
	{
		InvalidEmail: "email",
		DuplicateEmail: "email",
		RequiredEmail: "email",

		InvalidUserName: "username",
		DuplicateUserName: "username",
		RequiredUsername: "username",
    
    IncorrectCurrentPassword: "password",

		PasswordTooShort: "newPassword",
		PasswordRequiresDigit: "newPassword",
		PasswordRequiresLower: "newPassword",
		PasswordRequiresUpper: "newPassword",
		PasswordRequiresNonAlphanumeric: "newPassword",
		PasswordRequiresUniqueChars: "newPassword",
		RequiredPassword: "newPassword",

		PasswordMismatch: "confirmPassword",
		RequiredConfirmPassword: "confirmPassword",
	};
// -------------------------------------------------------------------------------------------------
// Common Validation Errors
// -------------------------------------------------------------------------------------------------
export const invalidLoginCredentials: ValidationError = {
	code: "InvalidLoginCredentials",
	description: "Invalid Email or Password",
};

export const passwordMismatch: ValidationError = {
	code: "PasswordMismatch",
	description: "Passwords must match",
};

export const requiredEmail: ValidationError = {
	code: "RequiredEmail",
	description: "Email is required",
};
export const requiredUsername: ValidationError = {
	code: "RequiredUsername",
	description: "Username is required",
};
export const requiredPassword: ValidationError = {
	code: "RequiredPassword",
	description: "Password is required",
};
export const incorrectCurrentPassword: ValidationError = {
	code: "IncorrectCurrentPassword",
	description: "Current password is incorrect",
};
