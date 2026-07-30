import type { PaginationMeta } from "@/features/master-admins/api/admin.types";

export type UsagePeriod = "THIS_MONTH" | "LAST_MONTH" | "THIS_QUARTER";
export type UsageDateScope = { period?: UsagePeriod; month?: number; year?: number };
export type UsageOverview = {
  stats: { totalAiLogs: number; totalFailedRequests: number; successRate: number; estimatedCost: number };
  chart: Array<{ date: string; aiLogs: number; estimatedCost: number }>;
  summary: Array<{ companyId: string; companyName: string; logo: string | null; aiLogs: number; sharePercentage: number }>;
};
export type UsageCompanyRow = {
  company: { id: string; name: string; logo: string | null };
  aiLogs: number;
  failedRequests: number;
  successRate: number;
  lastProcessedAt: string | null;
  sharePercentage: number;
  estimatedCost: number;
};
export type UsageCompanyDetail = {
  company: { id: string; name: string; logo: string | null; plan: string; businessType: string; status: string };
  limitSummary: { monthlyAiLogLimit: number; aiLogsUsagePercent: number; estimatedCostUsagePercent: number };
  stats: { totalAiLogs: number; failedRequests: number; estimatedCost: number; successRate: number; trackedDays: number };
  breakdown: Array<{ date: string; aiLogs: number; failedRequests: number; estimatedCost: number }>;
};
export type UsageCompaniesParams = { page?: number; limit?: number; period?: UsagePeriod; month?: number; year?: number; companyId?: string };
export type UsageCompaniesMeta = PaginationMeta;
