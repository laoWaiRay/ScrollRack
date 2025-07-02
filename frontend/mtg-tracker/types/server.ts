export interface AuthResult<ReturnT> {
	data?: ReturnT;
  error?: ServerError;
  success: boolean;
}

export interface ServerError {
  status: number;
  data: any;
}

export class ServerApiError extends Error implements ServerError {
  status: number;
  data: any;

  constructor(status: number, data: any) {
    super(`API Error: ${status}`);
    this.name = "ServerApiError";
    this.status = status;
    this.data = data;
  }
}