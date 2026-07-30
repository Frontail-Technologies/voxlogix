export type ExtractedLogFields = Record<string, string | number | null>;

export type ExtractLogFieldsPayload = {
  transcript: string;
  moduleId: string;
  equipmentId?: string | null;
};
