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
  return apiRequest(apiEndpoints.auth.changePassword, {
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

export async function verifyResetOtp(payload: { identifier: string; otp: string }) {
  return apiRequest<{ valid: boolean }>(apiEndpoints.auth.verifyOtp, {
    method: "POST",
    body: payload,
  });
}

export async function resetPassword(payload: { identifier: string; otp: string; newPassword: string; confirmPassword: string }) {
  return apiRequest<{ id: string }>(apiEndpoints.auth.resetPassword, {
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
  return useMutation({ mutationFn: changePassword });
}

export function useForgotPassword() {
  return useMutation({ mutationFn: forgotPassword });
}

export function useVerifyResetOtp() {
  return useMutation({ mutationFn: verifyResetOtp });
}

export function useResetPassword() {
  return useMutation({ mutationFn: resetPassword });
}
