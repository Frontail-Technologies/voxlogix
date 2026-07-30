export type EquipmentListItem = {
  id: string;
  equipmentCode: string;
  name: string;
  category: string;
  section: string;
  subLocation: string;
  criticality: string;
  status: string;
  imageUrl: string | null;
  latitude: string | null;
  longitude: string | null;
  mapUrl: string | null;
  updatedAt: string;
};

export type EquipmentDetail = EquipmentListItem & {
  locationId: string | null;
  makeBrand: string | null;
  modelNumber: string | null;
  notes: string | null;
  commissionedAt: string | null;
  createdAt: string;
  location: {
    id: string | null;
    plant: string | null;
    unit: string | null;
    section: string | null;
    subLocation: string | null;
    shiftDetails?: string | null;
    department?: string | null;
  };
};

export type EquipmentListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  criticality?: string;
  section?: string;
};

export type EquipmentPayload = {
  locationId?: string | null;
  equipmentCode: string;
  name: string;
  category?: string;
  section: string;
  subLocation: string;
  makeBrand?: string | null;
  modelNumber?: string | null;
  criticality?: string;
  status?: string;
  imageUrl?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  mapUrl?: string | null;
  notes?: string | null;
  commissionedAt?: string | null;
};

