import { useMutation, useQueryClient } from "@tanstack/react-query";

import { companyKeys } from "@/features/master-companies/api/company.keys";
import type { CompanyAccess, CompanyPayload, UpdateCompanyPayload } from "@/features/master-companies/api/company.types";
import { apiRequest } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";

export function createCompany(payload: CompanyPayload | FormData) {
  return apiRequest(apiEndpoints.companies.root, { method: "POST", body: payload });
}
export function updateCompany(companyId: string, payload: UpdateCompanyPayload | FormData) {
  return apiRequest(apiEndpoints.companies.byId(companyId), { method: "PATCH", body: payload });
}
export function deleteCompany(companyId: string) {
  return apiRequest(apiEndpoints.companies.byId(companyId), { method: "DELETE" });
}
export function updateCompanyAccess(companyId: string, payload: Partial<CompanyAccess>) {
  return apiRequest(apiEndpoints.companies.access(companyId), { method: "PATCH", body: payload });
}
export function useCreateCompany() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: createCompany, onSuccess: () => queryClient.invalidateQueries({ queryKey: companyKeys.all }) });
}
export function useUpdateCompany(companyId: string) {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: (payload: UpdateCompanyPayload | FormData) => updateCompany(companyId, payload), onSuccess: () => queryClient.invalidateQueries({ queryKey: companyKeys.all }) });
}
export function useDeleteCompany() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: deleteCompany, onSuccess: () => queryClient.invalidateQueries({ queryKey: companyKeys.all }) });
}
export function useUpdateCompanyAccess(companyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<CompanyAccess>) => updateCompanyAccess(companyId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: companyKeys.access(companyId) });
      void queryClient.invalidateQueries({ queryKey: companyKeys.detail(companyId) });
      void queryClient.invalidateQueries({ queryKey: companyKeys.list() });
    },
  });
}


