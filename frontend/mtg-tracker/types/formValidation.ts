export interface ValidationError {
	code: string;
	description: string;
}

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
	constructor(
		public email: ValidationError[] = [],
		public username: ValidationError[] = [],
		public password: ValidationError[] = [],
		public confirmPassword: ValidationError[] = [],
		public unknown: ValidationError[] = []
	) {}
}

export const registerFormErrorFieldMap: Record<string, keyof RegisterFormData> =
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
