import { useMutation } from "@tanstack/react-query";

import type { EquipmentListItem } from "@/features/admin-equipment/api/equipment.types";
import type { EquipmentSummary } from "@/features/ai-chat/api/chat.types";
import { apiRequest } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";

type ChatPayload = {
  equipmentId?: string;
  message: string;
  sessionId?: string;
};

type ChatResponse = {
  reply: string;
  sessionId: string;
  equipment?: EquipmentSummary | null;
  suggestions?: EquipmentListItem[];
};

export function sendChatMessage(payload: ChatPayload) {
  return apiRequest<ChatResponse>(apiEndpoints.ai.chat, {
    method: "POST",
    body: payload,
    timeoutMs: 45_000,
  });
}

export function useSendChatMessage() {
  return useMutation({ mutationFn: sendChatMessage });
}
