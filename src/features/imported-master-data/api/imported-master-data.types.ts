import type { PaginationMeta } from "@/features/master-admins/api/admin.types";

export type ImportedMasterDataSource = "safetyReporting" | "measuringPoints" | "meterCounters" | "kaizen";
export type ImportedMasterDataListParams = { page?: number; limit?: number; search?: string; status?: string };

export type SafetyReportingItem = {
  id: string;
  safetyCategoryCode: string | null;
  incidentCategory: string;
  incidentType: string;
  severityLevel: string;
  requiresPpe: string;
  ppeType: string | null;
  reportable: string;
  immediateActionRequired: string;
  notes: string | null;
  status: string;
  updatedAt: string;
};
export type LatestReadingSummary = {
  value: string;
  status: string;
  isAlert: boolean;
  reportedAt: string;
} | null;

export type MeasuringPointItem = {
  id: string;
  pointCode: string;
  measurementName: string;
  equipmentCodeSnapshot: string | null;
  measurementUnit: string;
  targetValue: string | null;
  lowerLimit: string | null;
  upperLimit: string | null;
  measurementFrequency: string | null;
  alertSeverity: string;
  instrumentTag: string | null;
  notes: string | null;
  status: string;
  updatedAt: string;
  latestReading: LatestReadingSummary;
};
export type MeterCounterItem = {
  id: string;
  counterCode: string;
  counterName: string;
  equipmentCodeSnapshot: string | null;
  location: string | null;
  counterUnit: string;
  meterType: string;
  readingFrequency: string | null;
  initialReading: string | null;
  resetValue: string | null;
  expectedDailyConsumption: string | null;
  alertDeviationPct: string | null;
  notes: string | null;
  status: string;
  updatedAt: string;
  latestReading: LatestReadingSummary;
};
export type KaizenCategoryItem = {
  id: string;
  kaizenCategoryCode: string | null;
  category: string;
  department: string | null;
  kaizenStatus: string | null;
  immediateActionRequired: string | null;
  notes: string | null;
  status: string;
  updatedAt: string;
};
export type ImportedMasterDataItem = SafetyReportingItem | MeasuringPointItem | MeterCounterItem | KaizenCategoryItem;

export type UpdateSafetyReportingPayload = Partial<Omit<SafetyReportingItem, "id" | "updatedAt">>;
export type UpdateMeasuringPointPayload = Partial<Omit<MeasuringPointItem, "id" | "equipmentCodeSnapshot" | "updatedAt" | "targetValue" | "lowerLimit" | "upperLimit">> & {
  targetValue?: number | null;
  lowerLimit?: number | null;
  upperLimit?: number | null;
};
export type UpdateMeterCounterPayload = Partial<Omit<MeterCounterItem, "id" | "equipmentCodeSnapshot" | "updatedAt" | "initialReading" | "resetValue" | "expectedDailyConsumption" | "alertDeviationPct">> & {
  initialReading?: number | null;
  resetValue?: number | null;
  expectedDailyConsumption?: number | null;
  alertDeviationPct?: number | null;
};
export type UpdateKaizenCategoryPayload = Partial<Omit<KaizenCategoryItem, "id" | "updatedAt">>;
export type MeasuringPointReadingHistoryItem = {
  id: string;
  reportLogId: string;
  pointCode: string;
  measurementName: string;
  measurementUnit: string;
  measuredValue: number;
  targetValue: number | null;
  lowerLimit: number | null;
  upperLimit: number | null;
  deviationFromTarget: number | null;
  deviationPercent: number | null;
  measurementStatus: string;
  isAlert: boolean;
  reportedAt: string;
  reportedBy: { id: string; fullName: string } | null;
};
export type MeterCounterReadingHistoryItem = {
  id: string;
  reportLogId: string;
  counterCode: string;
  counterName: string;
  counterUnit: string;
  currentReading: number;
  previousReading: number | null;
  consumptionDelta: number | null;
  expectedConsumptionForPeriod: number | null;
  deviation: number | null;
  deviationPercent: number | null;
  alertDeviationPct: number | null;
  counterStatus: string;
  isAlert: boolean;
  reportedAt: string;
  reportedBy: { id: string; fullName: string } | null;
};

export type UpdateImportedMasterDataPayload =
  | UpdateSafetyReportingPayload
  | UpdateMeasuringPointPayload
  | UpdateMeterCounterPayload
  | UpdateKaizenCategoryPayload;

export type { PaginationMeta };
