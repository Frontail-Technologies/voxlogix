import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authKeys } from "@/features/auth/api/auth.keys";
import type { LoginPayload, SessionUser } from "@/features/auth/api/auth.types";
import { apiRequest } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";

export async function login(payload: LoginPayload) {
  return apiRequest<SessionUser>(apiEndpoints.auth.login, {
    method: "POST",
    body: payload,
  });
}

export async function logout() {
  return apiRequest(apiEndpoints.auth.logout, { method: "POST" });
}

export async function changePassword(payload: { currentPassword: string; newPassword: string }) {
  return apiRequest<SessionUser>(apiEndpoints.auth.changePassword, {
    method: "POST",
    body: payload,
  });
}

export async function forgotPassword(payload: { identifier: string }) {
  return apiRequest<{ message: string }>(apiEndpoints.auth.forgotPassword, {
    method: "POST",
    body: payload,
  });
}

export async function resetPassword(payload: { token: string; newPassword: string; confirmPassword: string }) {
  return apiRequest<{ message: string }>(apiEndpoints.auth.resetPassword, {
    method: "POST",
    body: payload,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: async (response) => {
      queryClient.setQueryData(authKeys.currentUser(), response);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: authKeys.all });
    },
  });
}

export function useChangePassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changePassword,
    onSuccess: async (response) => {
      // The backend issues a fresh session (new cookies/tokens) with
      // requirePasswordReset=false — update the cached user immediately so
      // the app doesn't bounce back to /change-password before a refetch.
      queryClient.setQueryData(authKeys.currentUser(), response);
    },
  });
}

export function useForgotPassword() {
  return useMutation({ mutationFn: forgotPassword });
}

export function useResetPassword() {
  return useMutation({ mutationFn: resetPassword });
}
