export type PaginationMeta = {
  page: number;
  limit: number;
  offset: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type AdminCompanyOption = {
  id: string;
  name: string;
  status: string;
  plan: string;
};

export type AdminListItem = {
  id: string;
  fullName: string;
  initials: string;
  avatarUrl: string | null;
  avatarKey: string | null;
  username: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  joinedOn: string;
  lastLoginAt: string | null;
  company: {
    id: string;
    name: string;
  };
};

export type AdminDetail = {
  id: string;
  fullName: string;
  initials: string;
  avatarUrl: string | null;
  avatarKey: string | null;
  username: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  requirePasswordReset: boolean;
  joinedOn: string;
  lastLoginAt: string | null;
  company: {
    id: string;
    name: string;
  };
  activitySummary: {
    companies: number;
    planners: number;
    executionUsers: number;
    logsCreated: number;
  };
  recentLoginHistory: Array<{
    id: string;
    loggedInAt: string;
    channel: string;
  }>;
};

export type AdminListParams = {
  page?: number;
  limit?: number;
  search?: string;
  companyId?: string;
  role?: string;
  status?: string;
  joinedFrom?: string;
  joinedTo?: string;
};

export type CreateAdminPayload = {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  companyId: string;
  role?: string;
  status: string;
  temporaryPassword: string;
  confirmPassword: string;
  requirePasswordReset?: boolean;
  sendWelcomeEmail?: boolean;
  avatarUrl?: string | null;
  avatarKey?: string | null;
};

export type UpdateAdminPayload = {
  fullName?: string;
  username?: string;
  email?: string;
  phone?: string;
  companyId?: string;
  role?: string;
  status?: string;
  requirePasswordReset?: boolean;
  sendWelcomeEmail?: boolean;
  avatarUrl?: string | null;
  avatarKey?: string | null;
};

export type ResetAdminPasswordPayload = {
  temporaryPassword: string;
  confirmPassword: string;
  requireResetOnNextLogin?: boolean;
  sendNotificationEmail?: boolean;
};




