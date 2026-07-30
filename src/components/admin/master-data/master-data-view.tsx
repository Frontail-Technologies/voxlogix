"use client";

import Link from "next/link";

import { AppIcon, type AppIconName } from "@/components/common/app-icon";
import { DashboardPageHeader } from "@/components/common/dashboard-ui";
import { buttonVariants } from "@/components/ui/button";
import { useModulesList } from "@/features/master-modules/api/module.queries";
import { cn } from "@/lib/utils";

const masterDataLinks: Array<{
  title: string;
  description: string;
  href: string;
  icon: AppIconName;
  tone: string;
  requiredModules?: string[];
}> = [
  {
    title: "Equipment",
    description: "Maintain asset codes, criticality, location mapping, and images.",
    href: "/admin/equipment",
    icon: "equipment",
    tone: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300",
    requiredModules: ["equipment log"],
  },
  {
    title: "Equipment Manuals",
    description: "Upload manuals and store AI-ready context for equipment support.",
    href: "/admin/equipment/manuals",
    icon: "database",
    tone: "bg-indigo-500/12 text-indigo-700 dark:text-indigo-300",
    requiredModules: ["equipment log"],
  },
  {
    title: "Issue Categories",
    description: "Define issue labels, module mapping, default severity, and impact.",
    href: "/admin/issue-categories",
    icon: "warning",
    tone: "bg-red-500/12 text-red-700 dark:text-red-300",
    requiredModules: ["equipment log", "safety log", "shift log"],
  },
  {
    title: "Equipment Categories",
    description: "Manage category labels available on the equipment form.",
    href: "/admin/equipment-categories",
    icon: "equipment",
    tone: "bg-violet-500/12 text-violet-700 dark:text-violet-300",
    requiredModules: ["equipment log"],
  },
  {
    title: "Safety Reporting",
    description: "Review imported safety categories, PPE, reportable flags, and actions.",
    href: "/admin/safety-reporting",
    icon: "permissions",
    tone: "bg-red-500/12 text-red-700 dark:text-red-300",
    requiredModules: ["safety log"],
  },
  {
    title: "Measuring Points",
    description: "Review manual measurement limits, units, frequency, and alert rules.",
    href: "/admin/measuring-points",
    icon: "activity",
    tone: "bg-blue-500/12 text-blue-700 dark:text-blue-300",
    requiredModules: ["measurement point"],
  },
  {
    title: "Meter Counters",
    description: "Review counter limits, expected consumption, and deviation rules.",
    href: "/admin/meter-counters",
    icon: "database",
    tone: "bg-cyan-500/12 text-cyan-700 dark:text-cyan-300",
    requiredModules: ["meter counter"],
  },
  {
    title: "Kaizen",
    description: "Review suggestion categories, departments, status, and action mapping.",
    href: "/admin/kaizen",
    icon: "ai",
    tone: "bg-orange-500/12 text-orange-700 dark:text-orange-300",
    requiredModules: ["kaizen"],
  },
  {
    title: "Locations & Shifts",
    description: "Manage plant, unit, section, sub-location, shift, and department mapping.",
    href: "/admin/locations",
    icon: "planning",
    tone: "bg-yellow-500/12 text-yellow-700 dark:text-yellow-300",
    requiredModules: ["shift log"],
  },
];

export function MasterDataView() {
  const modulesQuery = useModulesList({ page: 1, limit: 100, status: "ACTIVE" });
  const enabledModules = new Set(
    (modulesQuery.data?.data ?? []).map((module) => module.name.trim().toLowerCase()),
  );
  const visibleLinks = masterDataLinks.filter((item) => {
    if (!item.requiredModules?.length) return true;
    if (modulesQuery.isLoading || modulesQuery.isError) return true;
    return item.requiredModules.some((moduleName) => enabledModules.has(moduleName));
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader
        title="Master Data"
        description="Company operational data used by logs, equipment selection, AI extraction, and reporting. Module access controls which sources appear here."
        action={
          <Link href="/admin/master-data/import" className={cn(buttonVariants({ variant: "outline" }), "rounded-xl")}>
            <AppIcon name="upload" className="size-4" />
            Import Data
          </Link>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        {visibleLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group rounded-2xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/50"
          >
            <div className={cn("flex size-11 items-center justify-center rounded-xl", item.tone)}>
              <AppIcon name={item.icon} className="size-5" />
            </div>
            <h2 className="mt-4 text-sm font-semibold text-card-foreground group-hover:text-primary">
              {item.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

