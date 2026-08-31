const defaultApiBaseUrl = "http://localhost:5000/api";

export const apiEndpoints = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? defaultApiBaseUrl,
  health: "/health",
  auth: {
    login: "/auth/login",
    me: "/auth/me",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
    changePassword: "/auth/change-password",
    forgotPassword: "/auth/forgot-password",
    verifyOtp: "/auth/verify-otp",
    resetPassword: "/auth/reset-password",
  },
  dashboard: {
    summary: "/dashboard/summary",
    executionSummary: "/dashboard/execution-summary",
  },
  ai: {
    extractLogFields: "/ai/extract-log-fields",
    chat: "/ai/chat",
    chatSessions: "/ai/chat/sessions",
    chatSessionById: (sessionId: string) => `/ai/chat/sessions/${sessionId}`,
  },
  activities: {
    root: "/activities",
  },
  aiUsage: {
    overview: "/ai-usage/overview",
    companies: "/ai-usage/companies",
    companyById: (companyId: string) => `/ai-usage/companies/${companyId}`,
  },
  settings: {
    general: "/settings/general",
    ai: "/settings/ai",
    aiById: (configId: string) => `/settings/ai/${configId}`,
    aiDefault: (configId: string) => `/settings/ai/${configId}/default`,
  },
  companies: {
    root: "/companies",
    options: "/companies/options",
    byId: (companyId: string) => `/companies/${companyId}`,
    access: (companyId: string) => `/companies/${companyId}/access`,
  },
  admins: {
    root: "/admins",
    byId: (adminId: string) => `/admins/${adminId}`,
    resetPassword: (adminId: string) => `/admins/${adminId}/reset-password`,
  },
  equipment: {
    root: "/equipment",
    byId: (equipmentId: string) => `/equipment/${equipmentId}`,
  },
  equipmentManuals: {
    root: "/equipment-manuals",
    byId: (manualId: string) => `/equipment-manuals/${manualId}`,
  },
  logs: {
    root: "/logs",
    byId: (logId: string) => `/logs/${logId}`,
    status: (logId: string) => `/logs/${logId}/status`,
    attachments: (logId: string) => `/logs/${logId}/attachments`,
    attachmentById: (logId: string, attachmentId: string) =>
      `/logs/${logId}/attachments/${attachmentId}`,
    bulkDelete: "/logs/bulk-delete",
  },
  reports: {
    kpiDashboard: "/reports/kpi-dashboard",
    outputSummary: "/reports/output/summary",
    outputExport: "/reports/output/export",
  },
  locations: {
    root: "/locations",
    byId: (locationId: string) => `/locations/${locationId}`,
  },
  issueCategories: {
    root: "/issue-categories",
    byId: (issueCategoryId: string) => `/issue-categories/${issueCategoryId}`,
  },
  equipmentCategories: {
    root: "/equipment-categories",
    byId: (equipmentCategoryId: string) => `/equipment-categories/${equipmentCategoryId}`,
  },
  masterDataImports: {
    finalTemplate: "/master-data-imports/final-template",
    sampleTemplate: "/master-data-imports/sample-template",
  },
  masterDataOptions: {
    bySource: (sourceKey: string) => `/master-data-options/${sourceKey}`,
  },
  importedMasterData: {
    safetyReporting: "/imported-master-data/safety-reporting",
    measuringPoints: "/imported-master-data/measuring-points",
    meterCounters: "/imported-master-data/meter-counters",
    kaizen: "/imported-master-data/kaizen",
  },
  modules: {
    root: "/modules",
    byId: (moduleId: string) => `/modules/${moduleId}`,
    fields: (moduleId: string) => `/modules/${moduleId}/fields`,
    fieldById: (moduleId: string, fieldId: string) =>
      `/modules/${moduleId}/fields/${fieldId}`,
  },
  moduleTypes: {
    root: "/module-types",
    byId: (moduleTypeId: string) => `/module-types/${moduleTypeId}`,
  },
  moduleCategories: {
    root: "/module-categories",
    byId: (moduleCategoryId: string) => `/module-categories/${moduleCategoryId}`,
  },
  uploads: {
    images: "/uploads/images",
    audio: "/uploads/audio",
    signed: "/uploads/signed",
    assets: "/uploads/assets",
  },
} as const;




