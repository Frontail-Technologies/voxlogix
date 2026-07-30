import { useMutation, useQueryClient } from "@tanstack/react-query";

import { adminKeys } from "@/features/master-admins/api/admin.keys";
import type {
  CreateAdminPayload,
  ResetAdminPasswordPayload,
  UpdateAdminPayload,
} from "@/features/master-admins/api/admin.types";
import { apiRequest } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";

export async function createAdmin(payload: CreateAdminPayload | FormData) {
  return apiRequest(apiEndpoints.admins.root, {
    method: "POST",
    body: payload,
  });
}

export async function updateAdmin(adminId: string, payload: UpdateAdminPayload | FormData) {
  return apiRequest(apiEndpoints.admins.byId(adminId), {
    method: "PATCH",
    body: payload,
  });
}

export async function resetAdminPassword(
  adminId: string,
  payload: ResetAdminPasswordPayload,
) {
  return apiRequest(apiEndpoints.admins.resetPassword(adminId), {
    method: "POST",
    body: payload,
  });
}

export async function deleteAdmin(adminId: string) {
  return apiRequest(apiEndpoints.admins.byId(adminId), {
    method: "DELETE",
  });
}

export function useCreateAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAdmin,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
}

export function useUpdateAdmin(adminId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateAdminPayload | FormData) => updateAdmin(adminId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
}

export function useResetAdminPassword(adminId: string) {
  return useMutation({
    mutationFn: (payload: ResetAdminPasswordPayload) =>
      resetAdminPassword(adminId, payload),
  });
}

export function useDeleteAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdmin,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
}

