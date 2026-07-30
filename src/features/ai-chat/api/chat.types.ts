import type { EquipmentListItem } from "@/features/admin-equipment/api/equipment.types";

export type EquipmentSummary = {
  id: string;
  name: string;
  equipmentCode: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  suggestions?: EquipmentListItem[];
};

export type ChatSessionSummary = {
  id: string;
  title: string;
  equipmentId: string | null;
  equipmentName: string | null;
  updatedAt: string;
};

export type ChatSessionDetail = {
  id: string;
  title: string;
  equipmentId: string | null;
  createdAt: string;
  updatedAt: string;
  messages: { id: string; role: "user" | "assistant"; content: string; createdAt: string }[];
};
