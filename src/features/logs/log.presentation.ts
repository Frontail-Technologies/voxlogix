export const logStatuses = [
  { value: "DRAFT", label: "Draft" },
  { value: "SUBMITTED", label: "Submitted" },
  { value: "PLANNED", label: "Planned" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "NEEDS_CORRECTION", label: "Needs Correction" },
] as const;

export const logSeverities = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "CRITICAL", label: "Critical" },
] as const;

export const logModules = [
  { value: "SHIFT", label: "Shift" },
  { value: "EQUIPMENT", label: "Equipment" },
  { value: "SAFETY", label: "Safety" },
  { value: "MEASUREMENT", label: "Measurement" },
  { value: "SUGGESTION", label: "Suggestion" },
  { value: "KAIZEN", label: "Kaizen" },
] as const;

export function normalizeLogValue(value?: string | null) {
  return String(value ?? "")
    .trim()
    .replace(/[\s-]+/g, "_")
    .toUpperCase();
}

export function logLabel(value?: string | null) {
  const normalized = normalizeLogValue(value);

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
  const normalized = normalizeLogValue(value);
  return options.some((option) => option.value === normalized)
    ? normalized
    : fallback;
}

export function formatLogDate(value?: string | null) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatMinutes(value?: number | null) {
  if (!value) return "0 min";
  if (value < 60) return `${value} min`;

  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  return minutes ? `${hours}h ${minutes}m` : `${hours}h`;
}

export function formatSeconds(value?: number | null) {
  if (!value) return "0 sec";
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;
  return minutes ? `${minutes}m ${seconds}s` : `${seconds}s`;
}

export function fieldValueLabel(value: unknown) {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return JSON.stringify(value);
}
