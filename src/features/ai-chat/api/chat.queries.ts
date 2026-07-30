import { useQuery } from "@tanstack/react-query";

import { chatKeys } from "@/features/ai-chat/api/chat.keys";
import type { ChatSessionDetail, ChatSessionSummary } from "@/features/ai-chat/api/chat.types";
import { apiRequest } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { detailQueryOptions, listQueryOptions } from "@/lib/api/query-options";

export function getChatSessions() {
  return apiRequest<ChatSessionSummary[]>(apiEndpoints.ai.chatSessions);
}

export function getChatSession(sessionId: string) {
  return apiRequest<ChatSessionDetail>(apiEndpoints.ai.chatSessionById(sessionId));
}

export function useChatSessions() {
  return useQuery({ queryKey: chatKeys.list(), queryFn: getChatSessions, ...listQueryOptions });
}

export function useChatSession(sessionId?: string) {
  return useQuery({
    queryKey: chatKeys.detail(sessionId ?? ""),
    queryFn: () => getChatSession(sessionId!),
    enabled: Boolean(sessionId),
    ...detailQueryOptions,
  });
}
