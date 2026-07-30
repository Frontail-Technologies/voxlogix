export const masterDataStatuses = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
] as const;

export const moduleTypeOptions = [
  { value: "EQUIPMENT", label: "Equipment" },
  { value: "SAFETY", label: "Safety" },
  { value: "SHIFT", label: "Shift" },
  { value: "MEASUREMENT", label: "Measurement" },
  { value: "SUGGESTION", label: "Suggestion" },
  { value: "KAIZEN", label: "Kaizen" },
] as const;

export const severityOptions = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "CRITICAL", label: "Critical" },
] as const;

export function normalizeMasterDataValue(value?: string | null) {
  return String(value ?? "")
    .trim()
    .replace(/[\s-]+/g, "_")
    .toUpperCase();
}

export function masterDataLabel(value?: string | null) {
  const normalized = normalizeMasterDataValue(value);
  if (!normalized) return "-";
  return normalized.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatMasterDataDate(value?: string | null) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}
