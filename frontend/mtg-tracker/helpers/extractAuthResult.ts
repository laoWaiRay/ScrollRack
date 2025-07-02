import { AuthResult, ServerApiError } from "@/types/server";

export function extractAuthResult<T>(authResult: AuthResult<T>) {
	if (!authResult.success) {
		const { status = 500, data = "Error" } = authResult.error ?? {};
		throw new ServerApiError(status, data);
	}
  
  if (authResult.data) {
    return authResult.data;
  }
  
  return null;
}
