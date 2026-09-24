import { useMutation } from "@tanstack/react-query";

import { apiRequest } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";

export type SendAdminNotificationPayload = {
  audience: "SELECTED" | "ALL";
  recipientUserIds?: string[];
  title: string;
  message: string;
};

export function sendAdminNotification(payload: SendAdminNotificationPayload) {
  return apiRequest<{ sent: number }>(apiEndpoints.notifications.adminSend, {
    method: "POST",
    body: payload,
  });
}

export function useSendAdminNotification() {
  return useMutation({ mutationFn: sendAdminNotification });
}
