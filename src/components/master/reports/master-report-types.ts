export const masterReportTypes = [
  "companies",
  "admins",
  "modules",
  "ai-usage",
  "company-access",
  "activities",
] as const;

export type MasterReportType = (typeof masterReportTypes)[number];

export function isMasterReportType(value: string): value is MasterReportType {
  return masterReportTypes.includes(value as MasterReportType);
}
