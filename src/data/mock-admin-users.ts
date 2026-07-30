export type CompanyUserRole = "Planner" | "Execution";
export type CompanyUserStatus = "Active" | "Inactive";

export type CompanyUser = {
  id: string;
  employeeId: string;
  fullName: string;
  initials: string;
  email: string;
  phone: string;
  role: CompanyUserRole;
  section: string;
  shift: string;
  status: CompanyUserStatus;
  canVerify: boolean;
  canExport: boolean;
  notes: string;
  assignedLogs: number;
  logsCreated: number;
};

export const userSections = [
  "Boiler House",
  "Utility Block",
  "Material Handling",
  "Power House",
];

export const userShifts = ["Morning", "Afternoon", "Night"];

export const userRoles: CompanyUserRole[] = ["Planner", "Execution"];

export const userStatuses: CompanyUserStatus[] = ["Active", "Inactive"];

export const companyUsers: CompanyUser[] = [
  {
    id: "usr-101",
    employeeId: "EMP-101",
    fullName: "Ravi Shankar",
    initials: "RS",
    email: "ravi.shankar@voxlogix.com",
    phone: "+91 98765 43210",
    role: "Planner",
    section: "Boiler House",
    shift: "Morning",
    status: "Active",
    canVerify: true,
    canExport: true,
    notes: "Leads shift planning for Boiler Unit 1 and 2.",
    assignedLogs: 18,
    logsCreated: 0,
  },
  {
    id: "usr-102",
    employeeId: "EMP-102",
    fullName: "Meena Kumari",
    initials: "MK",
    email: "meena.kumari@voxlogix.com",
    phone: "+91 98765 43211",
    role: "Planner",
    section: "Utility Block",
    shift: "Afternoon",
    status: "Active",
    canVerify: true,
    canExport: false,
    notes: "Reviews compressor and utility logs before close-out.",
    assignedLogs: 12,
    logsCreated: 0,
  },
  {
    id: "usr-103",
    employeeId: "EMP-103",
    fullName: "Arjun Verma",
    initials: "AV",
    email: "arjun.verma@voxlogix.com",
    phone: "+91 98765 43212",
    role: "Planner",
    section: "Power House",
    shift: "Night",
    status: "Inactive",
    canVerify: false,
    canExport: false,
    notes: "On extended leave, logs reassigned to Meena for now.",
    assignedLogs: 0,
    logsCreated: 0,
  },
  {
    id: "usr-104",
    employeeId: "EMP-104",
    fullName: "Priya Nair",
    initials: "PN",
    email: "priya.nair@voxlogix.com",
    phone: "+91 98765 43213",
    role: "Planner",
    section: "Material Handling",
    shift: "Morning",
    status: "Active",
    canVerify: true,
    canExport: true,
    notes: "Handles conveyor and yard equipment planning.",
    assignedLogs: 9,
    logsCreated: 0,
  },
  {
    id: "usr-201",
    employeeId: "EMP-201",
    fullName: "Suresh Babu",
    initials: "SB",
    email: "suresh.babu@voxlogix.com",
    phone: "+91 98765 43214",
    role: "Execution",
    section: "Boiler House",
    shift: "Morning",
    status: "Active",
    canVerify: false,
    canExport: false,
    notes: "Primary operator for Feed Water Pump inspections.",
    assignedLogs: 0,
    logsCreated: 64,
  },
  {
    id: "usr-202",
    employeeId: "EMP-202",
    fullName: "Kavya Reddy",
    initials: "KR",
    email: "kavya.reddy@voxlogix.com",
    phone: "+91 98765 43215",
    role: "Execution",
    section: "Utility Block",
    shift: "Afternoon",
    status: "Active",
    canVerify: false,
    canExport: false,
    notes: "Logs compressor readings and safety checks.",
    assignedLogs: 0,
    logsCreated: 41,
  },
  {
    id: "usr-203",
    employeeId: "EMP-203",
    fullName: "Deepak Chauhan",
    initials: "DC",
    email: "deepak.chauhan@voxlogix.com",
    phone: "+91 98765 43216",
    role: "Execution",
    section: "Material Handling",
    shift: "Night",
    status: "Active",
    canVerify: false,
    canExport: true,
    notes: "Night shift lead for conveyor breakdown logs.",
    assignedLogs: 0,
    logsCreated: 55,
  },
  {
    id: "usr-204",
    employeeId: "EMP-204",
    fullName: "Anita George",
    initials: "AG",
    email: "anita.george@voxlogix.com",
    phone: "+91 98765 43217",
    role: "Execution",
    section: "Power House",
    shift: "Morning",
    status: "Inactive",
    canVerify: false,
    canExport: false,
    notes: "Transferred to a different plant, pending offboarding.",
    assignedLogs: 0,
    logsCreated: 8,
  },
];
