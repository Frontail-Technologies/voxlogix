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
  // The list endpoint is metadata-only (no PDF fetch/parse per row) and returns just the
  // extracted-text length, not the text itself. Fetch a single manual's detail for full text.
  extractedTextLength: number;
  createdAt: string;
  updatedAt: string;
  equipment: {
    id: string;
    equipmentCode: string;
    name: string;
  };
};

export type EquipmentManualDetail = Omit<EquipmentManualListItem, "extractedTextLength"> & {
  extractedText: string | null;
};

export type { PaginationMeta };
