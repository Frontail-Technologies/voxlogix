import type { AppIconName } from "@/components/common/app-icon";

export type CreateLogModule = {
  key: string;
  name: string;
  icon: AppIconName;
  active: boolean;
};

export const createLogModules: CreateLogModule[] = [
  { key: "equipment-log", name: "Equipment Log", icon: "equipment", active: true },
  { key: "safety-log", name: "Safety Log", icon: "warning", active: false },
  { key: "measurement-point", name: "Measurement Point", icon: "dashboard", active: false },
  { key: "meter-counter", name: "Meter Counter", icon: "package", active: false },
];

export const issueCategoryOptions = [
  "Unusual Noise",
  "Vibration",
  "Overheating",
  "Leakage",
  "Belt Misalignment",
  "Calibration Due",
  "Power Trip",
  "Safety Guard Missing",
];

export const aiProcessingSteps = [
  "Processing voice",
  "Converting speech to text",
  "Extracting equipment details",
  "Preparing log",
];

export type AiExtractedIssue = {
  issueCategory: string;
  problemDescription: string;
  failureMode: string;
  rootCause: string;
  actionTaken: string;
  downtimeMinutes: number;
  sparePartReference: string;
  pendingWork: string;
  notes: string;
};

export const mockAiExtractedIssue: AiExtractedIssue = {
  issueCategory: "Unusual Noise",
  problemDescription:
    "Operator reported a loud grinding noise from the equipment during startup, along with slight vibration.",
  failureMode: "Bearing wear",
  rootCause: "Suspected bearing degradation due to a lubrication gap.",
  actionTaken: "Flagged for planner review before further operation.",
  downtimeMinutes: 20,
  sparePartReference: "SP-BRG-6205",
  pendingWork: "Replace bearing and verify alignment during the next shutdown window.",
  notes: "Execution team advised to avoid running the equipment at full load until reviewed.",
};
