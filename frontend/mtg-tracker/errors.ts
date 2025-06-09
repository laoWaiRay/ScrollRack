type ErrorName =
  | "LOGIN_ERROR";

export class AppError extends Error {
  constructor(
    public name: ErrorName,
    public message: string,
    public innerException?: any
  ) { super(); }
}