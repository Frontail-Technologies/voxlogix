import { useMutation, useQueryClient } from "@tanstack/react-query";

import { adminEquipmentKeys } from "@/features/admin-equipment/api/equipment.keys";
import { adminEquipmentManualKeys } from "@/features/admin-equipment-manuals/api/equipment-manual.keys";
import type {
  EquipmentManualDetail,
  EquipmentManualPayload,
} from "@/features/admin-equipment-manuals/api/equipment-manual.types";
import { apiRequest } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";

export function createEquipmentManual(payload: EquipmentManualPayload | FormData) {
  return apiRequest<EquipmentManualDetail>(apiEndpoints.equipmentManuals.root, {
    method: "POST",
    body: payload,
  });
}

export function updateEquipmentManual(manualId: string, payload: Partial<EquipmentManualPayload> | FormData) {
  return apiRequest<EquipmentManualDetail>(apiEndpoints.equipmentManuals.byId(manualId), {
    method: "PATCH",
    body: payload,
  });
}

export function deleteEquipmentManual(manualId: string) {
  return apiRequest<{ id: string }>(apiEndpoints.equipmentManuals.byId(manualId), {
    method: "DELETE",
  });
}

export function useCreateEquipmentManual() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEquipmentManual,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminEquipmentManualKeys.all });
      queryClient.invalidateQueries({ queryKey: adminEquipmentKeys.all });
    },
  });
}

export function useDeleteEquipmentManual() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEquipmentManual,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminEquipmentManualKeys.all });
      queryClient.invalidateQueries({ queryKey: adminEquipmentKeys.all });
    },
  });
}