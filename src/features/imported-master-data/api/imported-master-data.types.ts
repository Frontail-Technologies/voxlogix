import type { PaginationMeta } from "@/features/master-admins/api/admin.types";

export type ImportedMasterDataSource = "safetyReporting" | "measuringPoints" | "meterCounters" | "kaizen";
export type ImportedMasterDataListParams = { page?: number; limit?: number; search?: string; status?: string };
export type SafetyReportingItem = { id: string; incidentCategory: string; incidentType: string; severityLevel: string; requiresPpe: string; reportable: string; immediateActionRequired: string; status: string; updatedAt: string };
export type MeasuringPointItem = { id: string; pointCode: string; measurementName: string; equipmentCodeSnapshot: string | null; measurementUnit: string; lowerLimit: string | null; upperLimit: string | null; alertSeverity: string; status: string; updatedAt: string };
export type MeterCounterItem = { id: string; counterCode: string; counterName: string; equipmentCodeSnapshot: string | null; location: string | null; counterUnit: string; meterType: string; expectedDailyConsumption: string | null; alertDeviationPct: string | null; status: string; updatedAt: string };
export type KaizenCategoryItem = { id: string; category: string; department: string | null; kaizenStatus: string | null; immediateActionRequired: string | null; status: string; updatedAt: string };
export type ImportedMasterDataItem = SafetyReportingItem | MeasuringPointItem | MeterCounterItem | KaizenCategoryItem;
export type { PaginationMeta };
