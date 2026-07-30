export type AdminLogListItem = {
  id: string;
  logNumber: string;
  moduleType: string;
  title: string;
  issueCategory: string | null;
  severity: string;
  status: string;
  aiProcessed: number;
  downtimeMinutes: number;
  createdAt: string;
  updatedAt: string;
  thumbnailUrl: string | null;
  equipment: { id: string | null; equipmentCode: string | null; name: string | null; section: string | null; subLocation: string | null } | null;
  createdBy: { id: string | null; fullName: string | null; initials: string | null };
};

export type AdminLogDetail = AdminLogListItem & {
  description: string | null;
  transcript: string | null;
  voiceDurationSeconds: number;
  voiceRecordingUrl: string | null;
  voiceRecordingKey: string | null;
  extractedFields: Record<string, unknown>;
  capturedLatitude: string | null;
  capturedLongitude: string | null;
  capturedAddress: string | null;
  module?: { id: string | null; name: string | null; type: string | null };
  attachments: Array<{ id: string; url: string; key: string | null; fileName: string | null; mimeType: string | null; label: string | null; sortOrder: number; createdAt: string }>;
  timeline: Array<{ id: string; actorNameSnapshot: string; event: string; status: string | null; notes: string | null; createdAt: string }>;
};

export type AdminLogListParams = { page?: number; limit?: number; search?: string; status?: string; severity?: string; moduleType?: string; equipmentId?: string; createdById?: string };
export type AdminLogPayload = {
  moduleId?: string | null;
  equipmentId?: string | null;
  assignedPlannerId?: string | null;
  moduleType: string;
  title: string;
  description?: string | null;
  transcript?: string | null;
  issueCategory?: string | null;
  severity?: string;
  status?: string;
  aiProcessed?: boolean;
  voiceDurationSeconds?: number;
  voiceRecordingUrl?: string | null;
  voiceRecordingKey?: string | null;
  downtimeMinutes?: number;
  extractedFields?: Record<string, unknown>;
  capturedLatitude?: number | null;
  capturedLongitude?: number | null;
  capturedAddress?: string | null;
};
export type AdminLogAttachmentPayload = { url: string; key?: string | null; fileName?: string | null; mimeType?: string | null; label?: string | null; sortOrder?: number };
