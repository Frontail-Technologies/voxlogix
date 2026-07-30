export type ApiErrorItem = {
  field?: string;
  message: string;
};

export type ApiSuccessResponse<TData = unknown, TMeta = Record<string, unknown>> = {
  success: true;
  message: string;
  data?: TData;
  meta?: TMeta;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  errorCode?: string;
  errors: ApiErrorItem[];
};

export type ApiResponse<TData = unknown, TMeta = Record<string, unknown>> =
  | ApiSuccessResponse<TData, TMeta>
  | ApiErrorResponse;

export class ApiClientError extends Error {
  public readonly status: number;
  public readonly errorCode?: string;
  public readonly errors: ApiErrorItem[];

  constructor(
    message: string,
    options: {
      status: number;
      errorCode?: string;
      errors?: ApiErrorItem[];
    },
  ) {
    super(message);
    this.name = "ApiClientError";
    this.status = options.status;
    this.errorCode = options.errorCode;
    this.errors = options.errors ?? [];
  }
}
