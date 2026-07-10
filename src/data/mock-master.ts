import type { AppIconName } from "@/components/common/app-icon";

export type MasterStat = {
  label: string;
  value: string;
  helper: string;
  icon: AppIconName;
  tone: "amber" | "green" | "orange" | "purple" | "red" | "blue" | "teal" | "navy";
};

export const masterStats: MasterStat[] = [
  { label: "Total Companies", value: "24", helper: "View all companies", icon: "companies", tone: "amber" },
  { label: "Active Companies", value: "18", helper: "75% of total", icon: "status", tone: "green" },
  { label: "Total Admins / Owners", value: "42", helper: "View all admins", icon: "admins", tone: "orange" },
  { label: "Total Planners", value: "64", helper: "Across active companies", icon: "planning", tone: "purple" },
  { label: "Total Execution Users", value: "256", helper: "View all executors", icon: "users", tone: "purple" },
  { label: "Total Logs", value: "12,540", helper: "All time logs", icon: "logs", tone: "red" },
  { label: "AI Processed Logs", value: "11,230", helper: "89.5% success rate", icon: "ai", tone: "blue" },
  { label: "AI Usage This Month", value: "1,245 min", helper: "+12.5% vs last month", icon: "voice", tone: "teal" },
  { label: "Storage Used", value: "320 GB", helper: "45% of total storage", icon: "storage", tone: "blue" },
];

export const aiChartPoints = [42, 48, 45, 55, 47, 52, 44, 40, 36, 43, 50, 60, 58, 49, 44, 38, 42, 46, 55, 52, 61, 58, 74];

export const recentPlatformActivity = [
  { title: 'Company "ABC Industries" created', actor: "Master Super", time: "2 mins ago", icon: "companies" as AppIconName, tone: "blue" as const },
  { title: 'Admin "John Doe" created for ABC Industries', actor: "Master Super", time: "15 mins ago", icon: "admins" as AppIconName, tone: "green" as const },
  { title: 'AI usage limit updated for "XYZ Pvt Ltd"', actor: "Master Super", time: "45 mins ago", icon: "ai" as AppIconName, tone: "purple" as const },
  { title: 'Company "LMN Corp" suspended', actor: "Master Super", time: "1 hour ago", icon: "warning" as AppIconName, tone: "red" as const },
  { title: 'New module "Measurement Point" added', actor: "Master Super", time: "2 hours ago", icon: "modules" as AppIconName, tone: "blue" as const },
];

export const masterActivities = [
  { event: 'Company "ABC Industries" created', company: "ABC Industries", user: "Master Super", action: "Created", area: "Companies", time: "2 mins ago", status: "Success" },
  { event: 'Admin "John Doe" created', company: "ABC Industries", user: "Master Super", action: "Created", area: "Admins", time: "15 mins ago", status: "Success" },
  { event: 'AI usage limit updated', company: "XYZ Pvt Ltd", user: "Master Super", action: "Updated", area: "AI Usage", time: "45 mins ago", status: "Success" },
  { event: 'Company "LMN Corp" suspended', company: "LMN Corp", user: "Master Super", action: "Suspended", area: "Companies", time: "1 hour ago", status: "Warning" },
  { event: 'Module "Measurement Point" added', company: "Platform", user: "Master Super", action: "Created", area: "Modules", time: "2 hours ago", status: "Success" },
  { event: "API key rotated", company: "Platform", user: "Master Super", action: "Updated", area: "Settings", time: "Yesterday", status: "Success" },
  { event: 'Trial days changed for "PQR Solutions"', company: "PQR Solutions", user: "Master Super", action: "Updated", area: "Companies", time: "Yesterday", status: "Success" },
];

export const companies = [
  { company: "ABC Industries", logo: "AI", owner: "John Doe", email: "john@abc.com", phone: "+91 98765 43210", status: "Active", plan: "Professional", expiryDate: "31 Dec 2026", startDate: "01 Jan 2025", businessType: "Manufacturing" },
  { company: "XYZ Pvt Ltd", logo: "XP", owner: "Jane Smith", email: "jane@xyz.com", phone: "+91 98765 43211", status: "Active", plan: "Business", expiryDate: "15 Nov 2026", startDate: "15 Nov 2024", businessType: "Maintenance Services" },
  { company: "LMN Corp", logo: "LC", owner: "Robert Brown", email: "robert@lmn.com", phone: "+91 98765 43212", status: "Demo", plan: "Demo", expiryDate: "10 Jun 2026", startDate: "10 Jun 2026", businessType: "Plant Operations" },
  { company: "PQR Solutions", logo: "PS", owner: "Michael Lee", email: "michael@pqr.com", phone: "+91 98765 43213", status: "Suspended", plan: "Business", expiryDate: "05 May 2026", startDate: "05 May 2025", businessType: "Industrial Services" },
  { company: "STU Enterprises", logo: "SE", owner: "Emily Davis", email: "emily@stu.com", phone: "+91 98765 43214", status: "Inactive", plan: "Professional", expiryDate: "20 Apr 2026", startDate: "20 Apr 2025", businessType: "Factory Operations" },
];

export const admins = [
  { admin: "John Doe", initials: "JD", company: "ABC Industries", email: "john@abc.com", phone: "+91 98765 43210", status: "Active", lastLogin: "31 May 2025, 10:30 AM", joinedOn: "01 Jan 2025" },
  { admin: "Jane Smith", initials: "JS", company: "XYZ Pvt Ltd", email: "jane@xyz.com", phone: "+91 98765 43211", status: "Active", lastLogin: "15 mins ago", joinedOn: "15 Nov 2024" },
  { admin: "Robert Brown", initials: "RB", company: "LMN Corp", email: "robert@lmn.com", phone: "+91 98765 43212", status: "Active", lastLogin: "1 hour ago", joinedOn: "10 Jun 2026" },
  { admin: "Michael Lee", initials: "ML", company: "PQR Solutions", email: "michael@pqr.com", phone: "+91 98765 43213", status: "Inactive", lastLogin: "3 days ago", joinedOn: "05 May 2025" },
  { admin: "Emily Davis", initials: "ED", company: "STU Enterprises", email: "emily@stu.com", phone: "+91 98765 43214", status: "Active", lastLogin: "4 hours ago", joinedOn: "20 Apr 2025" },
];

export const aiUsageStats = [
  { label: "Total Voice Minutes", value: "1,245 min", helper: "+12.5% vs last month", icon: "voice" as AppIconName, tone: "teal" as const },
  { label: "Total AI Logs", value: "11,230", helper: "+8.0% vs last month", icon: "ai" as AppIconName, tone: "blue" as const },
  { label: "Success Rate", value: "89.5%", helper: "+4.2% vs last month", icon: "status" as AppIconName, tone: "green" as const },
  { label: "Estimated Cost", value: "$1,245.30", helper: "+10.3% vs last month", icon: "billing" as AppIconName, tone: "amber" as const },
];

export const usageByCompany = [
  { company: "ABC Industries", logo: "AI", minutes: "330 min", aiLogs: "2,980", successRate: "90.5%", percentage: 25.7, cost: "$328.00", lastProcessed: "31 May 2025" },
  { company: "XYZ Pvt Ltd", logo: "XP", minutes: "280 min", aiLogs: "2,290", successRate: "87.2%", percentage: 22.5, cost: "$280.00", lastProcessed: "30 May 2025" },
  { company: "LMN Corp", logo: "LC", minutes: "210 min", aiLogs: "2,090", successRate: "88.1%", percentage: 16.9, cost: "$210.00", lastProcessed: "29 May 2025" },
  { company: "PQR Solutions", logo: "PS", minutes: "190 min", aiLogs: "1,400", successRate: "82.5%", percentage: 15.3, cost: "$190.00", lastProcessed: "28 May 2025" },
  { company: "STU Enterprises", logo: "SE", minutes: "120 min", aiLogs: "1,300", successRate: "79.4%", percentage: 9.6, cost: "$126.00", lastProcessed: "27 May 2025" },
];

export const selectedUsageCompanyStats = [
  { label: "Voice Minutes", value: "330 min", helper: "+12.2% this month", icon: "voice" as AppIconName, tone: "teal" as const },
  { label: "AI Processed Logs", value: "2,980", helper: "90.5% success rate", icon: "ai" as AppIconName, tone: "blue" as const },
  { label: "Failed Requests", value: "312", helper: "Mostly unclear audio", icon: "warning" as AppIconName, tone: "red" as const },
  { label: "Estimated Cost", value: "$328.00", helper: "$0.99 per minute avg", icon: "billing" as AppIconName, tone: "amber" as const },
];

export const usageDailyBreakdown = [
  { date: "01 May", minutes: "24 min", aiLogs: "210", failed: "18", cost: "$24.00" },
  { date: "06 May", minutes: "32 min", aiLogs: "286", failed: "21", cost: "$31.50" },
  { date: "11 May", minutes: "28 min", aiLogs: "244", failed: "30", cost: "$27.80" },
  { date: "16 May", minutes: "42 min", aiLogs: "390", failed: "36", cost: "$41.60" },
  { date: "21 May", minutes: "35 min", aiLogs: "318", failed: "24", cost: "$34.70" },
  { date: "26 May", minutes: "51 min", aiLogs: "470", failed: "40", cost: "$50.40" },
  { date: "31 May", minutes: "62 min", aiLogs: "560", failed: "47", cost: "$61.80" },
];

export const settingsTabs = [
  "General",
  "AI Settings",
];

export const selectedCompany = {
  ...companies[0],
  address: "Unit 4, Industrial Area, Pune, Maharashtra",
  notes: "Priority demo account for equipment log trials.",
  stats: [
    { label: "Company Since", value: "01 Jan 2025" },
    { label: "Expiry Date", value: "31 Dec 2026" },
    { label: "Total Admins", value: "5" },
    { label: "Planners", value: "12" },
    { label: "Execution Users", value: "45" },
    { label: "Total Logs", value: "2,540" },
    { label: "AI Usage This Month", value: "320 min" },
  ],
};

export const companyAccessToggles = [
  { label: "Voice Logging", enabled: true },
  { label: "AI Structured Extraction", enabled: true },
  { label: "Image Upload", enabled: true },
  { label: "Equipment Module", enabled: true },
  { label: "Shift Module", enabled: false },
  { label: "Safety Module", enabled: false },
  { label: "Counter / Meter Module", enabled: false },
  { label: "Suggestion Module", enabled: false },
  { label: "Reports", enabled: true },
  { label: "Export", enabled: true },
];

export const companyUsageStats = [
  { label: "Voice Minutes", value: "320 min", helper: "+9.8% this month", icon: "voice" as AppIconName, tone: "teal" as const },
  { label: "AI Logs", value: "2,540", helper: "89.5% success", icon: "ai" as AppIconName, tone: "blue" as const },
  { label: "Storage Used", value: "84 GB", helper: "26% of limit", icon: "storage" as AppIconName, tone: "navy" as const },
  { label: "Est. Cost", value: "$320.00", helper: "This month", icon: "billing" as AppIconName, tone: "amber" as const },
];

export const globalModules = [
  { name: "Equipment Log", category: "Operational", icon: "equipment" as AppIconName, status: "Active", availability: "Trial Enabled", fields: 6, createdOn: "01 Jan 2025" },
  { name: "Safety Log", category: "Operational", icon: "warning" as AppIconName, status: "Inactive", availability: "Coming Soon", fields: 7, createdOn: "15 Feb 2025" },
  { name: "Measurement Point", category: "Operational", icon: "status" as AppIconName, status: "Inactive", availability: "Coming Soon", fields: 6, createdOn: "20 Mar 2025" },
  { name: "Meter / Counter", category: "Operational", icon: "database" as AppIconName, status: "Inactive", availability: "Coming Soon", fields: 5, createdOn: "05 Apr 2025" },
  { name: "Shift", category: "Operational", icon: "calendar" as AppIconName, status: "Inactive", availability: "Coming Soon", fields: 5, createdOn: "18 Apr 2025" },
  { name: "Suggestion", category: "Operational", icon: "planning" as AppIconName, status: "Inactive", availability: "Coming Soon", fields: 4, createdOn: "02 May 2025" },
];

export const equipmentSchemaFields = [
  { label: "Equipment ID", key: "equipment_id", type: "Text", required: true, aiExtract: true, order: 1 },
  { label: "Equipment Name", key: "equipment_name", type: "Text", required: false, aiExtract: true, order: 2 },
  { label: "Section", key: "section", type: "Text", required: true, aiExtract: true, order: 3 },
  { label: "Sub Location", key: "sub_location", type: "Text", required: true, aiExtract: true, order: 4 },
  { label: "Issue Category", key: "issue_category", type: "Select", required: true, aiExtract: true, order: 5 },
];

export const selectedAdmin = {
  ...admins[0],
  role: "Admin",
  summary: [
    { label: "Companies", value: "1" },
    { label: "Planners", value: "6" },
    { label: "Execution Users", value: "18" },
    { label: "Logs Created", value: "450" },
  ],
};
