import { useQuery } from "@tanstack/react-query";

import { masterDataOptionKeys } from "@/features/master-data-options/api/master-data-option.keys";
import type { MasterDataOption, MasterDataOptionsParams } from "@/features/master-data-options/api/master-data-option.types";
import { apiRequest } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";
import { referenceQueryOptions } from "@/lib/api/query-options";

function queryString(params: Record<string, unknown>) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export async function getMasterDataOptions(params: MasterDataOptionsParams) {
  if (!params.sourceKey) {
    return { success: true, message: "Request successful", data: [] as MasterDataOption[] };
  }

  const response = await apiRequest<MasterDataOption[]>(
    `${apiEndpoints.masterDataOptions.bySource(params.sourceKey)}${queryString({ fieldKey: params.fieldKey })}`,
  );

  return { ...response, data: response.data ?? [] };
}

export function useMasterDataOptions(params: MasterDataOptionsParams, enabled = true) {
  return useQuery({
    queryKey: masterDataOptionKeys.list(params),
    queryFn: () => getMasterDataOptions(params),
    enabled: enabled && Boolean(params.sourceKey),
    ...referenceQueryOptions,
  });
}
