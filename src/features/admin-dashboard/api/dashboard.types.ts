export type AdminDashboardLog = {
  id: string;
  logNumber: string;
  title: string;
  issueCategory: string | null;
  severity: string;
  status: string;
  moduleType: string;
  createdAt: string;
  equipment: {
    id: string | null;
    equipmentCode: string | null;
    name: string | null;
  };
  createdBy?: {
    id: string | null;
    fullName: string | null;
  };
};

export type AdminDashboardCriticalIssue = Omit<AdminDashboardLog, "moduleType" | "createdBy">;

export type AdminDashboardSummary = {
  stats: {
    totalEquipment: number;
    totalLogs: number;
    pendingLogs: number;
    completedLogs: number;
    criticalIssues: number;
    equipmentNeedingAttention: number;
    activeUsers: number;
    activePlanners: number;
    activeExecutionUsers: number;
    aiProcessedLogs: number;
  };
  pending: {
    reviewCount: number;
    correctionCount: number;
    equipmentIssueCount: number;
  };
  equipmentHealth: Array<{ status: string; count: number }>;
  logsByStatus: Array<{ status: string; count: number }>;
  logsByModule: Array<{ moduleType: string; count: number }>;
  logsTrend: Array<{ label: string; count: number }>;
  recentLogs: AdminDashboardLog[];
  criticalIssues: AdminDashboardCriticalIssue[];
};
