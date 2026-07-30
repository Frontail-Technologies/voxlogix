export const adminEquipmentKeys = {
  all: ["admin-equipment"] as const,
  list: (params: Record<string, unknown> = {}) => [...adminEquipmentKeys.all, "list", params] as const,
  detail: (equipmentId: string) => [...adminEquipmentKeys.all, "detail", equipmentId] as const,
};
