import type { AppIconName } from "@/components/common/app-icon";

export type ModuleFieldType = "text" | "textarea" | "number" | "select" | "boolean" | "date";

export type DynamicModuleField = {
  key: string;
  label: string;
  type: ModuleFieldType;
  required?: boolean;
  options?: string[];
};

export type DynamicModuleSchema = {
  id: string;
  name: string;
  icon: AppIconName;
  colorToken: string;
  description: string;
  fields: DynamicModuleField[];
};

export const MODULE_SCHEMAS: DynamicModuleSchema[] = [
  {
    id: "shift",
    name: "Shift",
    icon: "calendar",
    colorToken: "var(--chart-2)",
    description: "Shift handovers, production notes, and daily work updates.",
    fields: [
      { key: "shiftName", label: "Shift Name", type: "text", required: true },
      { key: "team", label: "Team", type: "text" },
      { key: "workSummary", label: "Work Summary", type: "textarea", required: true },
      { key: "pendingWork", label: "Pending Work", type: "textarea" },
    ],
  },
  {
    id: "equipment",
    name: "Equipment",
    icon: "equipment",
    colorToken: "var(--primary)",
    description: "Equipment issues, breakdowns, service activity, and repair logs.",
    fields: [
      { key: "equipmentId", label: "Equipment ID", type: "text", required: true },
      { key: "issue", label: "Issue", type: "textarea", required: true },
      { key: "rootCause", label: "Root Cause", type: "textarea" },
      { key: "actionTaken", label: "Action Taken", type: "textarea" },
      { key: "downtimeMinutes", label: "Downtime Minutes", type: "number" },
      {
        key: "severity",
        label: "Severity",
        type: "select",
        options: ["Low", "Medium", "High", "Critical"],
      },
    ],
  },
  {
    id: "safety",
    name: "Safety",
    icon: "warning",
    colorToken: "var(--chart-3)",
    description: "Hazards, unsafe conditions, incidents, and immediate actions.",
    fields: [
      { key: "incidentType", label: "Incident Type", type: "text", required: true },
      { key: "location", label: "Location", type: "text", required: true },
      { key: "immediateAction", label: "Immediate Action", type: "textarea" },
      { key: "personInvolved", label: "Person Involved", type: "text" },
    ],
  },
  {
    id: "counter-meter",
    name: "Counter / Meter",
    icon: "status",
    colorToken: "var(--chart-4)",
    description: "Meter readings, measurement points, limits, and abnormal readings.",
    fields: [
      { key: "meterName", label: "Meter Name", type: "text", required: true },
      { key: "unit", label: "Unit of Measurement", type: "text", required: true },
      { key: "currentReading", label: "Current Reading", type: "number", required: true },
      { key: "targetValue", label: "Target Value", type: "number" },
      { key: "upperLimit", label: "Upper Limit", type: "number" },
      { key: "lowerLimit", label: "Lower Limit", type: "number" },
    ],
  },
  {
    id: "suggestion",
    name: "Suggestion",
    icon: "planning",
    colorToken: "var(--chart-5)",
    description: "Improvement ideas, safety suggestions, and cost-saving opportunities.",
    fields: [
      { key: "suggestionTitle", label: "Suggestion Title", type: "text", required: true },
      { key: "description", label: "Description", type: "textarea", required: true },
      { key: "expectedBenefit", label: "Expected Benefit", type: "textarea" },
      { key: "priority", label: "Priority", type: "select", options: ["Low", "Medium", "High"] },
    ],
  },
];
