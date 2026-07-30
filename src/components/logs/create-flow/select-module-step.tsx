"use client";

import { AppIcon, type AppIconName } from "@/components/common/app-icon";
import {
  CardContent,
  CardHeader,
  CardTitle,
  DashboardCard,
} from "@/components/common/dashboard-ui";
import { Badge } from "@/components/ui/badge";
import { useModulesList } from "@/features/master-modules/api/module.queries";
import type { ModuleListItem } from "@/features/master-modules/api/module.types";
import { cn } from "@/lib/utils";

const KNOWN_ICON_NAMES = new Set<string>([
  "activity", "arrow-left", "admins", "ai", "billing", "calendar", "caret-down", "caret-left",
  "caret-right", "companies", "dashboard", "database", "download", "eye", "eye-off", "equipment",
  "logs", "more", "modules", "notifications", "package", "permissions", "planet", "plus", "planning",
  "profile", "reports", "rocket", "search", "sign-out", "sidebar", "settings", "status", "storage",
  "sun", "image", "trash", "upload", "users", "voice", "warning",
]);

function resolveIcon(icon: string): AppIconName {
  return KNOWN_ICON_NAMES.has(icon) ? (icon as AppIconName) : "modules";
}

export function SelectModuleStep({
  selectedModuleId,
  onSelect,
}: {
  selectedModuleId: string | null;
  onSelect: (module: ModuleListItem) => void;
}) {
  const { data, isLoading, isError } = useModulesList({ status: "ACTIVE", limit: 50 });
  const modules = data?.data ?? [];

  return (
    <DashboardCard>
      <CardHeader className="border-b border-border/70 px-4 py-3 sm:px-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Select Activity Type</CardTitle>
          </div>
          <Badge className="w-fit rounded-full border-0 bg-primary/12 text-primary">
            AI assisted
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-4 py-4 sm:px-5">
        {isLoading ? <p className="text-sm text-muted-foreground">Loading modules...</p> : null}
        {isError ? <p className="text-sm text-muted-foreground">Could not load modules.</p> : null}
        {!isLoading && !isError ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {modules.length ? (
              modules.map((module) => {
                const isSelected = selectedModuleId === module.id;

                return (
                  <button
                    key={module.id}
                    type="button"
                    onClick={() => onSelect(module)}
                    className={cn(
                      "group relative overflow-hidden rounded-xl border p-3 text-left transition-all",
                      "cursor-pointer border-border bg-background hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-sm",
                      isSelected && "border-primary bg-primary/6 shadow-sm",
                    )}
                  >
                    <div className={cn("absolute inset-x-0 top-0 h-1", moduleTone(module.type))} />
                    <div className="flex items-start gap-3">
                      <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", moduleTone(module.type, "soft"))}>
                        <AppIcon name={resolveIcon(module.icon)} className="size-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-foreground">{module.name}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{module.fieldsCount} capture fields</p>
                          </div>
                          <AppIcon name="caret-right" className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                        </div>
                        <p className="mt-2 line-clamp-2 min-h-10 text-xs leading-5 text-muted-foreground">
                          {module.description ?? module.availabilityText}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="col-span-2 flex items-center gap-3 rounded-2xl border border-dashed border-border bg-secondary/40 p-4">
                <Badge className="rounded-md border-0 bg-muted text-muted-foreground">No modules</Badge>
                <p className="text-sm text-muted-foreground">No active modules are configured yet.</p>
              </div>
            )}
          </div>
        ) : null}
      </CardContent>
    </DashboardCard>
  );
}

function moduleTone(value: string, variant: "bar" | "soft" = "bar") {
  const normalized = value.toLowerCase();

  if (normalized.includes("safety")) {
    return variant === "soft"
      ? "bg-red-500/12 text-red-700 dark:bg-red-400/15 dark:text-red-300"
      : "bg-red-500";
  }

  if (normalized.includes("measure") || normalized.includes("meter")) {
    return variant === "soft"
      ? "bg-sky-500/12 text-sky-700 dark:bg-sky-400/15 dark:text-sky-300"
      : "bg-sky-500";
  }

  if (normalized.includes("suggest") || normalized.includes("kaizen")) {
    return variant === "soft"
      ? "bg-orange-500/12 text-orange-700 dark:bg-orange-400/15 dark:text-orange-300"
      : "bg-orange-500";
  }

  if (normalized.includes("shift") || normalized.includes("plan")) {
    return variant === "soft"
      ? "bg-violet-500/12 text-violet-700 dark:bg-violet-400/15 dark:text-violet-300"
      : "bg-violet-500";
  }

  return variant === "soft"
    ? "bg-emerald-500/12 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300"
    : "bg-emerald-500";
}

