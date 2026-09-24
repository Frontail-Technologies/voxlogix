export type AssignmentStatus = "SCHEDULED" | "CANCELLED" | "COMPLETED";

export type AssignmentExecutor = {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
};

export type ScheduledAssignment = {
  id: string;
  companyId: string;
  title: string;
  description: string | null;
  assignedToUserId: string;
  assignedByUserId: string;
  scheduledAt: string;
  status: AssignmentStatus;
  createdAt: string;
  updatedAt: string;
  assignedTo: AssignmentExecutor;
};

export type AssignmentPayload = {
  assignedToUserId: string;
  title: string;
  description?: string | null;
  scheduledAt: string;
};

export type AssignmentMutationResult = {
  assignment: ScheduledAssignment;
  notificationCreated: boolean;
};
