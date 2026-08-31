import { useMutation, useQueryClient } from "@tanstack/react-query";

import { adminLogKeys } from "@/features/logs/api/log.keys";
import type {
  AdminLogAttachmentPayload,
  AdminLogDetail,
  AdminLogPayload,
} from "@/features/logs/api/log.types";
import { apiRequest } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";

export function createLog(payload: AdminLogPayload) {
  return apiRequest<AdminLogDetail>(apiEndpoints.logs.root, {
    method: "POST",
    body: payload,
  });
}

export function updateLog(logId: string, payload: Partial<AdminLogPayload>) {
  return apiRequest<AdminLogDetail>(apiEndpoints.logs.byId(logId), {
    method: "PATCH",
    body: payload,
  });
}

export function updateLogStatus(
  logId: string,
  payload: { status: string; notes?: string },
) {
  return apiRequest<AdminLogDetail>(apiEndpoints.logs.status(logId), {
    method: "PATCH",
    body: payload,
  });
}

export function addLogAttachment(
  logId: string,
  payload: AdminLogAttachmentPayload,
) {
  return apiRequest<AdminLogDetail["attachments"][number] | null>(
    apiEndpoints.logs.attachments(logId),
    { method: "POST", body: payload },
  );
}

export function deleteLogAttachment(logId: string, attachmentId: string) {
  return apiRequest<{ id: string; logId: string }>(
    apiEndpoints.logs.attachmentById(logId, attachmentId),
    { method: "DELETE" },
  );
}

export function deleteLog(logId: string) {
  return apiRequest<{ id: string }>(apiEndpoints.logs.byId(logId), {
    method: "DELETE",
  });
}

export function bulkDeleteLogs(ids: string[]) {
  return apiRequest<{ ids: string[] }>(apiEndpoints.logs.bulkDelete, {
    method: "POST",
    body: { ids },
  });
}

export function useCreateLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLog,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminLogKeys.all }),
  });
}

export function useUpdateLog(logId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<AdminLogPayload>) => updateLog(logId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminLogKeys.all }),
  });
}

export function useUpdateLogStatus(logId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { status: string; notes?: string }) =>
      updateLogStatus(logId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminLogKeys.all }),
  });
}

export function useDeleteLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLog,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminLogKeys.all }),
  });
}

export function useBulkDeleteLogs() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkDeleteLogs,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminLogKeys.all }),
  });
}
