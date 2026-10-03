import type { PaginationMeta } from "@/features/master-admins/api/admin.types";

export type CompanyListItem = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  logoUrl: string | null;
  logoKey: string | null;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  businessType: string;
  plan: string;
  startDate: string | null;
  expiryDate: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  // Seat usage — present on all list items from the updated API.
  activeUsers?: number;
  userCreationLimit?: number;
};

export type CompanyDetail = CompanyListItem & {
  address: string | null;
  notes: string | null;
  stats: {
    activeUsers: number;
    activeAdmins: number;
    activePlanners: number;
    activeExecutionUsers: number;
    totalLogs: number;
    aiUsageThisMonthLogs: number;
    storageUsedGb: number;
    failedRequests: number;
    estimatedCost: number;
  };
  accessSummary: {
    userCreationLimit: number;
    availableSeats: number;
    aiUsageLimitMinutes: number;
    storageLimitGb: number;
  };
  enabledModules: Array<{
    id: string;
    slug: string;
    name: string;
    icon: string;
    color: string;
    status: string;
    type: string;
    category: string;
  }>;
};

export type CompanyAccess = {
  id: string;
  companyId: string;
  voiceLoggingEnabled: boolean;
  aiStructuredExtractionEnabled: boolean;
  imageUploadEnabled: boolean;
  captureDeviceLocationEnabled: boolean;
  enabledModuleIds: string[];
  enabledModules: CompanyDetail["enabledModules"];
  reportsEnabled: boolean;
  exportEnabled: boolean;
  userCreationLimit: number;
  aiUsageLimitMinutes: number;
  storageLimitGb: number;
  createdAt: string;
  updatedAt: string;
};

export type CompanyListParams = { page?: number; limit?: number; search?: string; status?: string };
export type CompanyPayload = {
  companyName: string;
  logo?: string | null;
  logoUrl?: string | null;
  logoKey?: string | null;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  businessType: string;
  planType: string;
  status: string;
  startDate?: string | null;
  expiryDate?: string | null;
  address?: string | null;
  notes?: string | null;
};
export type UpdateCompanyPayload = Partial<CompanyPayload>;
export type CompanyListMeta = PaginationMeta;


