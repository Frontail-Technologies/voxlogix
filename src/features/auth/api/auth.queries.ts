import { useQuery } from "@tanstack/react-query";

import { authKeys } from "@/features/auth/api/auth.keys";
import type { SessionUser } from "@/features/auth/api/auth.types";
import { apiRequest } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { referenceQueryOptions } from "@/lib/api/query-options";
import { ApiClientError } from "@/lib/api/types";

export async function getCurrentUser() {
  return apiRequest<SessionUser>(apiEndpoints.auth.me);
}

export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: getCurrentUser,
    retry: (failureCount, error) => {
      if (error instanceof ApiClientError && error.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
    ...referenceQueryOptions,
  });
}
