export const equipmentStatuses = [
  { value: "ACTIVE", label: "Active" },
  { value: "UNDER_MAINTENANCE", label: "Under Maintenance" },
  { value: "BREAKDOWN", label: "Breakdown" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "CRITICAL", label: "Critical" },
] as const;

export const equipmentCriticalities = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "CRITICAL", label: "Critical" },
] as const;

export function normalizeOptionValue(value?: string | null) {
  return String(value ?? "")
    .trim()
    .replace(/[\s-]+/g, "_")
    .toUpperCase();
}

export function optionLabel(value?: string | null) {
  const normalized = normalizeOptionValue(value);

  if (!normalized) return "-";

  return normalized
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function optionValueOrFallback(
  value: string | null | undefined,
  options: readonly { value: string }[],
  fallback: string,
) {
  const normalized = normalizeOptionValue(value);
  return options.some((option) => option.value === normalized)
    ? normalized
    : fallback;
}

export function equipmentInitials(name?: string | null, equipmentCode?: string | null) {
  const source = name?.trim() || equipmentCode?.trim() || "EQ";
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function formatEquipmentDate(value?: string | null) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function dateInputValue(value?: string | null) {
  if (!value) return undefined;

  return new Date(value).toISOString().slice(0, 10);
}
