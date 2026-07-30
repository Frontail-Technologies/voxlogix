export const adminEquipmentManualKeys = {
  all: ["admin-equipment-manuals"] as const,
  list: (params: Record<string, unknown> = {}) => [...adminEquipmentManualKeys.all, "list", params] as const,
  detail: (manualId: string) => [...adminEquipmentManualKeys.all, "detail", manualId] as const,
};