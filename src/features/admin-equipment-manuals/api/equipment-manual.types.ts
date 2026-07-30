import type { PaginationMeta } from "@/features/master-admins/api/admin.types";

export type EquipmentManualListParams = {
  page?: number;
  limit?: number;
  search?: string;
  equipmentId?: string;
  status?: string;
};

export type EquipmentManualPayload = {
  equipmentId: string;
  title: string;
  manualUrl?: string | null;
  manualText?: string | null;
  status?: string;
};

export type EquipmentManualListItem = {
  id: string;
  equipmentId: string;
  title: string;
  fileUrl: string | null;
  fileKey: string | null;
  fileName: string | null;
  mimeType: string | null;
  fileSize: number | null;
  status: string;
  extractedText: string | null;
  createdAt: string;
  updatedAt: string;
  equipment: {
    id: string;
    equipmentCode: string;
    name: string;
  };
};

export type EquipmentManualDetail = EquipmentManualListItem & {
  chunks: Array<{
    id: string;
    pageNumber: number | null;
    sectionTitle: string | null;
    chunkText: string;
    sortOrder: number;
  }>;
};

export type { PaginationMeta };