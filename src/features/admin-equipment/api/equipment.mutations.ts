import { useMutation, useQueryClient } from "@tanstack/react-query";

import { adminEquipmentKeys } from "@/features/admin-equipment/api/equipment.keys";
import type {
  EquipmentDetail,
  EquipmentPayload,
} from "@/features/admin-equipment/api/equipment.types";
import { apiRequest } from "@/lib/api/client";
import { apiEndpoints } from "@/lib/api/endpoints";

export function createEquipment(payload: EquipmentPayload | FormData) {
  return apiRequest<EquipmentDetail>(apiEndpoints.equipment.root, {
    method: "POST",
    body: payload,
  });
}

export function updateEquipment(
  equipmentId: string,
  payload: Partial<EquipmentPayload> | FormData,
) {
  return apiRequest<EquipmentDetail>(apiEndpoints.equipment.byId(equipmentId), {
    method: "PATCH",
    body: payload,
  });
}

export function deleteEquipment(equipmentId: string) {
  return apiRequest<{ id: string }>(apiEndpoints.equipment.byId(equipmentId), {
    method: "DELETE",
  });
}

export function useCreateEquipment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEquipment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminEquipmentKeys.all }),
  });
}

export function useUpdateEquipment(equipmentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<EquipmentPayload> | FormData) =>
      updateEquipment(equipmentId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminEquipmentKeys.all }),
  });
}

export function useDeleteEquipment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEquipment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminEquipmentKeys.all }),
  });
}
