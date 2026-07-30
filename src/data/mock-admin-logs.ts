import { equipment } from "@/data/mock-admin";
import { companyUsers } from "@/data/mock-admin-users";

export type LogStatus =
  | "Draft"
  | "Submitted"
  | "Planned"
  | "In Progress"
  | "Completed"
  | "Needs Correction";

export type LogSeverity = "Low" | "Medium" | "High" | "Critical";

export type EquipmentLog = {
  id: string;
  logId: string;
  equipmentId: string;
  equipmentName: string;
  section: string;
  subLocation: string;
  issueCategory: string;
  issue: string;
  rootCause: string;
  actionTaken: string;
  downtimeMinutes: number;
  severity: LogSeverity;
  createdBy: string;
  assignedPlanner: string | null;
  status: LogStatus;
  createdDate: string;
};

export const logStatuses: LogStatus[] = [
  "Draft",
  "Submitted",
  "Planned",
  "In Progress",
  "Completed",
  "Needs Correction",
];

export const logSeverities: LogSeverity[] = ["Low", "Medium", "High", "Critical"];

export const activeLogModule = "Equipment Log";

export const comingSoonLogModules = [
  "Shift Log",
  "Safety Log",
  "Counter / Meter Log",
  "Suggestion Log",
];

export const logSections = Array.from(
  new Set(equipment.map((item) => item.section)),
);

export const logDateRanges = ["Today", "This Week", "This Month", "This Quarter"];

const executionNames = companyUsers
  .filter((user) => user.role === "Execution")
  .map((user) => user.fullName);

export const logPlanners = companyUsers
  .filter((user) => user.role === "Planner")
  .map((user) => user.fullName);

const issueCategories = [
  "Unusual Noise",
  "Vibration",
  "Overheating",
  "Leakage",
  "Belt Misalignment",
  "Calibration Due",
  "Power Trip",
  "Safety Guard Missing",
];

export const equipmentLogs: EquipmentLog[] = [
  {
    id: "log-1001",
    logId: "LOG-1001",
    equipmentId: equipment[0].equipmentId,
    equipmentName: equipment[0].name,
    section: equipment[0].section,
    subLocation: equipment[0].subLocation,
    issueCategory: issueCategories[0],
    issue: "Feed Water Pump making a loud grinding noise during startup.",
    rootCause: "",
    actionTaken: "",
    downtimeMinutes: 0,
    severity: "Medium",
    createdBy: executionNames[0],
    assignedPlanner: logPlanners[0],
    status: "Submitted",
    createdDate: "10 Jul 2026",
  },
  {
    id: "log-1002",
    logId: "LOG-1002",
    equipmentId: equipment[1].equipmentId,
    equipmentName: equipment[1].name,
    section: equipment[1].section,
    subLocation: equipment[1].subLocation,
    issueCategory: issueCategories[1],
    issue: "Air Compressor showing high vibration on the discharge side.",
    rootCause: "Suspected loose mounting bolts.",
    actionTaken: "Tightened mounting bolts, monitoring for recurrence.",
    downtimeMinutes: 45,
    severity: "Medium",
    createdBy: executionNames[1],
    assignedPlanner: logPlanners[1],
    status: "In Progress",
    createdDate: "10 Jul 2026",
  },
  {
    id: "log-1003",
    logId: "LOG-1003",
    equipmentId: equipment[2].equipmentId,
    equipmentName: equipment[2].name,
    section: equipment[2].section,
    subLocation: equipment[2].subLocation,
    issueCategory: issueCategories[4],
    issue: "Belt Conveyor 3 tracking off-center, rubbing against the frame.",
    rootCause: "Idler misalignment from last realignment attempt.",
    actionTaken: "Sent back to execution for a clearer photo of the misalignment.",
    downtimeMinutes: 120,
    severity: "Critical",
    createdBy: executionNames[2],
    assignedPlanner: logPlanners[0],
    status: "Needs Correction",
    createdDate: "09 Jul 2026",
  },
  {
    id: "log-1004",
    logId: "LOG-1004",
    equipmentId: equipment[3].equipmentId,
    equipmentName: equipment[3].name,
    section: equipment[3].section,
    subLocation: equipment[3].subLocation,
    issueCategory: issueCategories[2],
    issue: "Diesel Generator running hotter than usual under load.",
    rootCause: "Radiator fins partially blocked with dust.",
    actionTaken: "Cleaned radiator fins and rechecked coolant level.",
    downtimeMinutes: 30,
    severity: "High",
    createdBy: executionNames[3],
    assignedPlanner: logPlanners[3],
    status: "Completed",
    createdDate: "09 Jul 2026",
  },
  {
    id: "log-1005",
    logId: "LOG-1005",
    equipmentId: equipment[4].equipmentId,
    equipmentName: equipment[4].name,
    section: equipment[4].section,
    subLocation: equipment[4].subLocation,
    issueCategory: issueCategories[6],
    issue: "Cooling Tower Fan tripped on overload during shift start.",
    rootCause: "",
    actionTaken: "",
    downtimeMinutes: 0,
    severity: "Low",
    createdBy: executionNames[0],
    assignedPlanner: null,
    status: "Draft",
    createdDate: "08 Jul 2026",
  },
  {
    id: "log-1006",
    logId: "LOG-1006",
    equipmentId: equipment[5].equipmentId,
    equipmentName: equipment[5].name,
    section: equipment[5].section,
    subLocation: equipment[5].subLocation,
    issueCategory: issueCategories[5],
    issue: "Boiler Feed Motor is due for its scheduled calibration check.",
    rootCause: "Routine calibration interval reached.",
    actionTaken: "",
    downtimeMinutes: 0,
    severity: "Low",
    createdBy: executionNames[1],
    assignedPlanner: logPlanners[2],
    status: "Planned",
    createdDate: "08 Jul 2026",
  },
  {
    id: "log-1007",
    logId: "LOG-1007",
    equipmentId: equipment[0].equipmentId,
    equipmentName: equipment[0].name,
    section: equipment[0].section,
    subLocation: equipment[0].subLocation,
    issueCategory: issueCategories[3],
    issue: "Minor leakage observed at the Feed Water Pump gland packing.",
    rootCause: "Worn gland packing seal.",
    actionTaken: "Replaced gland packing seal, no further leakage observed.",
    downtimeMinutes: 60,
    severity: "Medium",
    createdBy: executionNames[2],
    assignedPlanner: logPlanners[1],
    status: "Completed",
    createdDate: "07 Jul 2026",
  },
  {
    id: "log-1008",
    logId: "LOG-1008",
    equipmentId: equipment[2].equipmentId,
    equipmentName: equipment[2].name,
    section: equipment[2].section,
    subLocation: equipment[2].subLocation,
    issueCategory: issueCategories[7],
    issue: "Safety guard missing on Belt Conveyor 3 drive pulley.",
    rootCause: "Guard removed during last maintenance, not reinstalled.",
    actionTaken: "Replacement guard ordered, temporary barrier installed.",
    downtimeMinutes: 0,
    severity: "High",
    createdBy: executionNames[3],
    assignedPlanner: logPlanners[0],
    status: "In Progress",
    createdDate: "07 Jul 2026",
  },
  {
    id: "log-1009",
    logId: "LOG-1009",
    equipmentId: equipment[3].equipmentId,
    equipmentName: equipment[3].name,
    section: equipment[3].section,
    subLocation: equipment[3].subLocation,
    issueCategory: issueCategories[0],
    issue: "Diesel Generator failed to auto-start during the weekly drill.",
    rootCause: "",
    actionTaken: "",
    downtimeMinutes: 0,
    severity: "Critical",
    createdBy: executionNames[0],
    assignedPlanner: logPlanners[3],
    status: "Submitted",
    createdDate: "06 Jul 2026",
  },
  {
    id: "log-1010",
    logId: "LOG-1010",
    equipmentId: equipment[1].equipmentId,
    equipmentName: equipment[1].name,
    section: equipment[1].section,
    subLocation: equipment[1].subLocation,
    issueCategory: issueCategories[1],
    issue: "Air Compressor discharge filter appears clogged.",
    rootCause: "",
    actionTaken: "",
    downtimeMinutes: 0,
    severity: "Low",
    createdBy: executionNames[1],
    assignedPlanner: null,
    status: "Draft",
    createdDate: "06 Jul 2026",
  },
];

export const selectedLog = {
  ...equipmentLogs[1],
  transcript:
    "\"Hey, I'm at the air compressor near utility block, bay three. There's a pretty strong vibration coming from the discharge side, sounds like something's loose. Going to flag this before it gets worse.\"",
  media: [] as string[],
  timeline: [
    {
      label: "Log created",
      actor: executionNames[1],
      time: "10 Jul 2026, 9:12 AM",
      icon: "voice" as const,
      tone: "blue" as const,
    },
    {
      label: "AI structured fields extracted",
      actor: "VoxLogiX AI",
      time: "10 Jul 2026, 9:13 AM",
      icon: "ai" as const,
      tone: "purple" as const,
    },
    {
      label: "Assigned to planner",
      actor: logPlanners[1],
      time: "10 Jul 2026, 10:05 AM",
      icon: "planning" as const,
      tone: "amber" as const,
    },
    {
      label: "Marked In Progress",
      actor: logPlanners[1],
      time: "10 Jul 2026, 11:40 AM",
      icon: "activity" as const,
      tone: "orange" as const,
    },
  ],
  notes: "Follow up with execution team once mounting bolts are rechecked next shift.",
};
