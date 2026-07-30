import Link from "next/link";

import { AppIcon } from "@/components/common/app-icon";
import { CardContent, DashboardCard } from "@/components/common/dashboard-ui";
import { Button, buttonVariants } from "@/components/ui/button";
import type { EquipmentListItem } from "@/features/admin-equipment/api/equipment.types";
import { cn } from "@/lib/utils";

type LogSubmittedStepProps = {
  equipment: EquipmentListItem;
  logId: string | null;
  logsListHref: string;
  logDetailHref: (logId: string) => string;
  onCreateAnother: () => void;
};

export function LogSubmittedStep({
  equipment,
  logId,
  logsListHref,
  logDetailHref,
  onCreateAnother,
}: LogSubmittedStepProps) {
  return (
    <DashboardCard>
      <CardContent className="flex flex-col items-center gap-5 px-4 py-12 text-center sm:px-5">
        <div className="relative flex size-20 items-center justify-center rounded-full bg-emerald-500/12 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300">
          <span className="absolute inset-[-10px] rounded-full border border-emerald-500/20" />
          <AppIcon name="status" className="size-9" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground sm:text-xl">
            Log submitted successfully
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your log for {equipment.name} ({equipment.equipmentCode}) has been submitted
            for planner review.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 rounded-2xl border border-border bg-secondary/35 p-2">
          {logId ? (
            <Link href={logDetailHref(logId)} className={cn(buttonVariants(), "rounded-xl")}>
              View Log
            </Link>
          ) : null}
          <Button type="button" className="rounded-xl" onClick={onCreateAnother}>
            <AppIcon name="plus" className="size-4" />
            Create Another Log
          </Button>
          <Link href={logsListHref} className={cn(buttonVariants({ variant: "outline" }), "rounded-xl")}>
            Back to Logs
          </Link>
        </div>
      </CardContent>
    </DashboardCard>
  );
}
