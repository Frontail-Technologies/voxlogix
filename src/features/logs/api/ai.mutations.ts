import { useMutation } from "@tanstack/react-query";

import type { ExtractedLogFields, ExtractLogFieldsPayload } from "@/features/logs/api/ai.types";
import { apiRequest } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";

export function extractLogFields(payload: ExtractLogFieldsPayload) {
  return apiRequest<ExtractedLogFields>(apiEndpoints.ai.extractLogFields, {
    method: "POST",
    body: payload,
    timeoutMs: 45_000,
  });
}

export function useExtractLogFields() {
  return useMutation({ mutationFn: extractLogFields });
}
