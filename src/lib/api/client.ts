import { apiEndpoints } from "@/lib/api/endpoints";
import {
  ApiClientError,
  type ApiErrorResponse,
  type ApiSuccessResponse,
} from "@/lib/api/types";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  timeoutMs?: number;
};

const DEFAULT_TIMEOUT_MS = 30_000;
const AUTH_RETRY_EXCLUDED_PATHS = new Set<string>([
  apiEndpoints.auth.login,
  apiEndpoints.auth.logout,
  apiEndpoints.auth.refresh,
]);

let refreshPromise: Promise<boolean> | null = null;
let redirectingToLogin = false;

async function parseResponse<TData, TMeta>(
  response: Response,
): Promise<ApiSuccessResponse<TData, TMeta>> {
  const payload = (await response.json()) as
    | ApiSuccessResponse<TData, TMeta>
    | ApiErrorResponse;

  if (!response.ok || !payload.success) {
    throw new ApiClientError(payload.message || "Request failed", {
      status: response.status,
      errorCode: "errorCode" in payload ? payload.errorCode : undefined,
      errors: "errors" in payload ? payload.errors : [],
    });
  }

  return payload;
}

function canRefreshSession(path: string) {
  return !AUTH_RETRY_EXCLUDED_PATHS.has(path);
}

function redirectToLogin() {
  if (redirectingToLogin || typeof window === "undefined") return;
  if (window.location.pathname === "/login") return;

  redirectingToLogin = true;
  const next = `${window.location.pathname}${window.location.search}`;
  window.location.assign(`/login?expired=1&next=${encodeURIComponent(next)}`);
}

async function refreshSession() {
  if (!refreshPromise) {
    refreshPromise = fetch(`${apiEndpoints.baseUrl}${apiEndpoints.auth.refresh}`, {
      method: "POST",
      cache: "no-store",
      credentials: "include",
    })
      .then(async (response) => {
        if (!response.ok) {
          return false;
        }

        const payload = (await response.json().catch(() => null)) as
          | ApiSuccessResponse<unknown>
          | null;

        return Boolean(payload?.success);
      })
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

function buildRequestInit(
  options: RequestOptions,
  signal: AbortSignal,
): RequestInit {
  const { body, headers, timeoutMs, signal: requestSignal, ...rest } = options;
  void timeoutMs;
  void requestSignal;

  const isFormData = body instanceof FormData;

  return {
    ...rest,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(headers ?? {}),
    },
    body:
      body === undefined
        ? undefined
        : isFormData
          ? body
          : JSON.stringify(body),
    cache: "no-store",
    credentials: "include",
    signal,
  };
}

export async function apiRequest<TData, TMeta = Record<string, unknown>>(
  path: string,
  options: RequestOptions = {},
) {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, signal } = options;
  const timeoutController = new AbortController();
  const timeoutId = window.setTimeout(() => timeoutController.abort(), timeoutMs);

  if (signal) {
    signal.addEventListener("abort", () => timeoutController.abort(), { once: true });
  }

  try {
    const requestInit = buildRequestInit(options, timeoutController.signal);
    let response = await fetch(`${apiEndpoints.baseUrl}${path}`, requestInit);

    if (response.status === 401 && canRefreshSession(path)) {
      const refreshed = await refreshSession();

      if (refreshed) {
        response = await fetch(`${apiEndpoints.baseUrl}${path}`, requestInit);
      } else {
        redirectToLogin();
      }
    }

    const payload = await parseResponse<TData, TMeta>(response);

    if (redirectingToLogin && window.location.pathname === "/login") {
      redirectingToLogin = false;
    }

    return payload;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiClientError("The request timed out. Please try again.", {
        status: 0,
        errorCode: "TIMEOUT",
      });
    }

    if (error instanceof ApiClientError && error.status === 401 && canRefreshSession(path)) {
      redirectToLogin();
    }

    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}
