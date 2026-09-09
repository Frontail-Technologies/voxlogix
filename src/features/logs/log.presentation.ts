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

// Measuring Point and Meter Counter logs are created from a structured reading, not a
// voice recording — matched case-insensitively against the canonical module type so this
// still works for both the fixed "MEASUREMENT_POINT"/"METER_COUNTER" keys and (defensively)
// any stray legacy value. Mirrors mobile-app's identically-named helpers in
// features/logs/utils/log-detail.utils.ts — kept in sync by hand across the two apps since
// they're separate codebases, but same semantics.
export function isMeasuringPointLog(moduleType: string): boolean {
  return /measur/i.test(moduleType);
}

export function isMeterCounterLog(moduleType: string): boolean {
  return /meter|counter/i.test(moduleType) && !isMeasuringPointLog(moduleType);
}

export function isReadingLog(moduleType: string): boolean {
  return isMeasuringPointLog(moduleType) || isMeterCounterLog(moduleType);
}

export type ReadingSummaryRow = { label: string; value: string };

function readingField(fields: Record<string, unknown> | null | undefined, key: string): string {
  const value = fields?.[key];
  return value === null || value === undefined || value === "" ? "" : String(value);
}

function formatWithUnit(value: string, unit: string): string {
  if (!value) return "-";
  return unit ? `${value} ${unit}` : value;
}

// Reads the exact keys the backend actually writes for an out-of-limit/deviation alert
// (measuring-point.service.ts / meter-counter.service.ts) directly — not a module's
// configured report-field keys, which don't match these. This is the same extractedFields
// blob already returned with the log — an immutable snapshot recorded in the same
// transaction as the reading itself, so it's authoritative, not guessed or copied.
export function getReadingSummaryRows(moduleType: string, extractedFields: Record<string, unknown> | null | undefined): ReadingSummaryRow[] {
  const fields = extractedFields;
  const unit = readingField(fields, "unit");

  if (isMeasuringPointLog(moduleType)) {
    const pointCode = readingField(fields, "pointCode");
    const measurementName = readingField(fields, "measurementName");
    const measuredValue = readingField(fields, "measuredValue");
    const lowerLimit = readingField(fields, "lowerLimit");
    const upperLimit = readingField(fields, "upperLimit");
    const targetValue = readingField(fields, "targetValue");
    const status = readingField(fields, "measurementStatus") || readingField(fields, "readingStatus");

    const rows: ReadingSummaryRow[] = [];
    if (pointCode || measurementName) {
      rows.push({ label: "Measuring Point", value: [pointCode, measurementName].filter(Boolean).join(" — ") || "-" });
    }
    rows.push({ label: "Actual Reading", value: formatWithUnit(measuredValue, unit) });
    rows.push({
      label: "Allowed Range",
      value: lowerLimit && upperLimit ? formatWithUnit(`${lowerLimit}–${upperLimit}`, unit) : targetValue ? `Target: ${formatWithUnit(targetValue, unit)}` : "-",
    });
    if (status) rows.push({ label: "Status", value: logLabel(status) });
    return rows;
  }

  if (isMeterCounterLog(moduleType)) {
    const counterCode = readingField(fields, "counterCode");
    const counterName = readingField(fields, "counterName");
    const currentReading = readingField(fields, "currentReading");
    const previousReading = readingField(fields, "previousReading");
    const consumptionDelta = readingField(fields, "consumptionDelta");
    const deviationPercent = readingField(fields, "deviationPercent");
    const status = readingField(fields, "counterStatus") || readingField(fields, "readingStatus");

    const rows: ReadingSummaryRow[] = [];
    if (counterCode || counterName) {
      rows.push({ label: "Meter Counter", value: [counterCode, counterName].filter(Boolean).join(" — ") || "-" });
    }
    rows.push({ label: "Current Reading", value: formatWithUnit(currentReading, unit) });
    if (previousReading) rows.push({ label: "Previous Reading", value: formatWithUnit(previousReading, unit) });
    if (consumptionDelta) rows.push({ label: "Consumption", value: formatWithUnit(consumptionDelta, unit) });
    if (deviationPercent) rows.push({ label: "Deviation", value: `${deviationPercent}%` });
    if (status) rows.push({ label: "Status", value: logLabel(status) });
    return rows;
  }

  return [];
}
