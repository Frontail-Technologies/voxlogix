export type ExecutionDashboardLog = {
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
};

export type ExecutionDashboardSummary = {
  stats: {
    todayLogs: number;
    draftLogs: number;
    submittedLogs: number;
    completedLogs: number;
    correctionLogs: number;
  };
  recentLogs: ExecutionDashboardLog[];
};
