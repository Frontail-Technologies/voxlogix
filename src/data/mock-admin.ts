export type EquipmentStatus =
  | "Active"
  | "Under Maintenance"
  | "Breakdown"
  | "Inactive"
  | "Critical";

export type EquipmentCriticality = "Low" | "Medium" | "High" | "Critical";

export type Equipment = {
  id: string;
  equipmentId: string;
  imageUrl?: string;
  initials: string;
  name: string;
  section: string;
  subLocation: string;
  category: string;
  makeBrand: string;
  modelNumber: string;
  commissionedDate: string;
  criticality: EquipmentCriticality;
  notes: string;
  status: EquipmentStatus;
  logsCount: number;
  downtimeHoursThisMonth: number;
};

export const equipmentCategories = [
  "Pump",
  "Compressor",
  "Conveyor",
  "Generator",
  "HVAC",
  "Motor",
  "Boiler",
];

export const equipmentStatuses: EquipmentStatus[] = [
  "Active",
  "Under Maintenance",
  "Breakdown",
  "Inactive",
  "Critical",
];

export const equipmentCriticalities: EquipmentCriticality[] = [
  "Low",
  "Medium",
  "High",
  "Critical",
];

export const equipment: Equipment[] = [
  {
    id: "eq-101",
    equipmentId: "EQ-101",
    initials: "FW",
    name: "Feed Water Pump",
    section: "Boiler House",
    subLocation: "Section 2",
    category: "Pump",
    makeBrand: "Kirloskar",
    modelNumber: "KBL-450",
    commissionedDate: "12 Mar 2022",
    criticality: "High",
    notes: "Primary feed pump for Boiler Unit 1. Scheduled for seal upgrade next quarter.",
    status: "Active",
    logsCount: 42,
    downtimeHoursThisMonth: 3.5,
  },
  {
    id: "eq-102",
    equipmentId: "EQ-102",
    initials: "AC",
    name: "Air Compressor",
    section: "Utility Block",
    subLocation: "Bay 3",
    category: "Compressor",
    makeBrand: "Atlas Copco",
    modelNumber: "GA-75",
    commissionedDate: "05 Jul 2021",
    criticality: "Medium",
    notes: "Feeds instrument air across Plant A. Currently down for filter replacement.",
    status: "Under Maintenance",
    logsCount: 65,
    downtimeHoursThisMonth: 12,
  },
  {
    id: "eq-103",
    equipmentId: "EQ-103",
    initials: "BC",
    name: "Belt Conveyor 3",
    section: "Material Handling",
    subLocation: "Yard B",
    category: "Conveyor",
    makeBrand: "FLSmidth",
    modelNumber: "BC-3000",
    commissionedDate: "20 Jan 2020",
    criticality: "Critical",
    notes: "Repeated belt misalignment issues over the last quarter. Under close watch.",
    status: "Breakdown",
    logsCount: 88,
    downtimeHoursThisMonth: 26.5,
  },
  {
    id: "eq-104",
    equipmentId: "EQ-104",
    initials: "DG",
    name: "Diesel Generator",
    section: "Power House",
    subLocation: "DG Room 1",
    category: "Generator",
    makeBrand: "Cummins",
    modelNumber: "C500D5",
    commissionedDate: "15 Sep 2019",
    criticality: "High",
    notes: "Standby power for critical loads. Failed to auto-start during last drill.",
    status: "Critical",
    logsCount: 21,
    downtimeHoursThisMonth: 8,
  },
  {
    id: "eq-105",
    equipmentId: "EQ-105",
    initials: "CT",
    name: "Cooling Tower Fan",
    section: "Cooling Yard",
    subLocation: "Tower 2",
    category: "HVAC",
    makeBrand: "Voith",
    modelNumber: "CT-220",
    commissionedDate: "02 Feb 2018",
    criticality: "Low",
    notes: "Decommissioned pending replacement, kept for reference logs only.",
    status: "Inactive",
    logsCount: 5,
    downtimeHoursThisMonth: 0,
  },
  {
    id: "eq-106",
    equipmentId: "EQ-106",
    initials: "BM",
    name: "Boiler Feed Motor",
    section: "Boiler House",
    subLocation: "Section 1",
    category: "Motor",
    makeBrand: "Siemens",
    modelNumber: "1LE1001",
    commissionedDate: "09 Oct 2023",
    criticality: "Medium",
    notes: "Recently commissioned, part of the Unit 1 boiler upgrade.",
    status: "Active",
    logsCount: 14,
    downtimeHoursThisMonth: 0.5,
  },
];

export const selectedEquipment = {
  ...equipment[2],
  stats: [
    { label: "Total Logs", value: String(equipment[2].logsCount) },
    { label: "Downtime (This Month)", value: `${equipment[2].downtimeHoursThisMonth} hrs` },
    { label: "Repeated Issues", value: "4" },
    { label: "Last Breakdown", value: "08 Jul 2026" },
  ],
  downtimeSummary: {
    totalHoursThisMonth: 26.5,
    repeatedIssuesCount: 4,
    mostCommonFailureMode: "Belt misalignment",
    lastBreakdownDate: "08 Jul 2026",
  },
  relatedLogs: [
    {
      id: "log-701",
      title: "Conveyor belt slipping",
      module: "Equipment Log",
      status: "In Progress",
      severity: "High",
      loggedBy: "Execution - Ravi S",
      time: "6 hours ago",
    },
    {
      id: "log-698",
      title: "Unusual noise from motor",
      module: "Equipment Log",
      status: "Completed",
      severity: "Medium",
      loggedBy: "Execution - Meena K",
      time: "2 days ago",
    },
    {
      id: "log-680",
      title: "Belt misalignment detected",
      module: "Equipment Log",
      status: "Completed",
      severity: "High",
      loggedBy: "Execution - Ravi S",
      time: "1 week ago",
    },
    {
      id: "log-662",
      title: "Scheduled shift inspection",
      module: "Equipment Log",
      status: "Completed",
      severity: "Low",
      loggedBy: "Execution - Ravi S",
      time: "2 weeks ago",
    },
  ],
  serviceHistory: [
    {
      date: "10 Jun 2026",
      type: "Corrective Maintenance",
      technician: "Arun Kumar",
      notes: "Realigned belt tension and replaced worn idler.",
    },
    {
      date: "02 Feb 2026",
      type: "Inspection",
      technician: "Priya Nair",
      notes: "Routine inspection, flagged early belt wear.",
    },
    {
      date: "14 Nov 2025",
      type: "Preventive Maintenance",
      technician: "Arun Kumar",
      notes: "Lubricated bearings and checked motor alignment.",
    },
  ],
};
