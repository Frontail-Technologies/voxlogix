import { Badge } from "@/components/ui/badge";
import { normalizeOptionValue, optionLabel } from "@/features/admin-equipment/equipment.presentation";
import { cn } from "@/lib/utils";

const statusClasses: Record<string, string> = {
  ACTIVE:
    "bg-emerald-500/12 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300",
  UNDER_MAINTENANCE:
    "bg-amber-500/16 text-amber-700 dark:bg-amber-400/18 dark:text-amber-300",
  BREAKDOWN:
    "bg-red-500/12 text-red-700 dark:bg-red-400/16 dark:text-red-300",
  INACTIVE:
    "bg-muted text-muted-foreground dark:bg-muted dark:text-muted-foreground",
  CRITICAL:
    "bg-rose-600/15 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300",
};

export function EquipmentStatusBadge({ status }: { status: string }) {
  const normalized = normalizeOptionValue(status);

  return (
    <Badge
      className={cn(
        "rounded-md border-0",
        statusClasses[normalized] ?? statusClasses.INACTIVE,
      )}
    >
      {optionLabel(status)}
    </Badge>
  );
}

const criticalityClasses: Record<string, string> = {
  LOW: "bg-sky-500/12 text-sky-700 dark:bg-sky-400/15 dark:text-sky-300",
  MEDIUM:
    "bg-amber-500/16 text-amber-700 dark:bg-amber-400/18 dark:text-amber-300",
  HIGH: "bg-orange-500/14 text-orange-700 dark:bg-orange-400/18 dark:text-orange-300",
  CRITICAL: "bg-red-500/14 text-red-700 dark:bg-red-400/18 dark:text-red-300",
};

export function CriticalityBadge({ criticality }: { criticality: string }) {
  const normalized = normalizeOptionValue(criticality);

  return (
    <Badge
      className={cn(
        "rounded-md border-0",
        criticalityClasses[normalized] ?? criticalityClasses.MEDIUM,
      )}
    >
      {optionLabel(criticality)}
    </Badge>
  );
}
