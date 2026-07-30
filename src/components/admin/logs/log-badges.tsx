import { Badge } from "@/components/ui/badge";
import { logLabel, normalizeLogValue } from "@/features/logs/log.presentation";
import { cn } from "@/lib/utils";

const statusClasses: Record<string, string> = {
  DRAFT: "bg-muted text-muted-foreground dark:bg-muted dark:text-muted-foreground",
  SUBMITTED: "bg-sky-500/12 text-sky-700 dark:bg-sky-400/15 dark:text-sky-300",
  PLANNED:
    "bg-amber-500/16 text-amber-700 dark:bg-amber-400/18 dark:text-amber-300",
  IN_PROGRESS:
    "bg-orange-500/14 text-orange-700 dark:bg-orange-400/18 dark:text-orange-300",
  COMPLETED:
    "bg-emerald-500/12 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300",
  NEEDS_CORRECTION:
    "bg-red-500/12 text-red-700 dark:bg-red-400/16 dark:text-red-300",
};

export function LogStatusBadge({ status }: { status: string }) {
  const normalized = normalizeLogValue(status);

  return (
    <Badge
      className={cn(
        "rounded-md border-0",
        statusClasses[normalized] ?? statusClasses.DRAFT,
      )}
    >
      {logLabel(status)}
    </Badge>
  );
}

const severityClasses: Record<string, string> = {
  LOW: "bg-sky-500/12 text-sky-700 dark:bg-sky-400/15 dark:text-sky-300",
  MEDIUM:
    "bg-amber-500/16 text-amber-700 dark:bg-amber-400/18 dark:text-amber-300",
  HIGH: "bg-orange-500/14 text-orange-700 dark:bg-orange-400/18 dark:text-orange-300",
  CRITICAL: "bg-red-500/14 text-red-700 dark:bg-red-400/18 dark:text-red-300",
};

export function SeverityBadge({ severity }: { severity: string }) {
  const normalized = normalizeLogValue(severity);

  return (
    <Badge
      className={cn(
        "rounded-md border-0",
        severityClasses[normalized] ?? severityClasses.MEDIUM,
      )}
    >
      {logLabel(severity)}
    </Badge>
  );
}
