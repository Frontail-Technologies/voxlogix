"use client";

import { AppIcon } from "@/components/common/app-icon";
import { DashboardCard } from "@/components/common/dashboard-ui";
import { Button } from "@/components/ui/button";
import type { MasterDataImportResult } from "@/features/admin-master-data/api/master-data.types";

export function MasterDataImportSuccessPanel({
  result,
  removedCount,
  onDone,
}: {
  result: MasterDataImportResult;
  removedCount: number;
  onDone: () => void;
}) {
  const totals = result.sheets.reduce(
    (current, sheet) => ({
      imported: current.imported + sheet.imported,
      skipped: current.skipped + sheet.skipped,
    }),
    { imported: 0, skipped: 0 },
  );

  return (
    <div className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-xl flex-col items-center justify-center gap-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-500/14 text-emerald-600 dark:text-emerald-400">
        <AppIcon name="database" className="size-7" />
      </div>
      <div>
        <h1 className="text-xl font-semibold text-foreground">Master Data Imported</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {totals.imported} imported{totals.skipped ? ` · ${totals.skipped} rejected` : ""}{removedCount ? ` · ${removedCount} removed` : ""}
        </p>
      </div>

      <DashboardCard className="w-full p-5 text-left">
        <div className="divide-y divide-border">
          {result.sheets
            .filter((sheet) => sheet.imported > 0 || sheet.skipped > 0)
            .map((sheet) => (
              <div key={sheet.sheet} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{sheet.sheet}</p>
                  <p className="text-xs text-muted-foreground">
                    {sheet.created} created · {sheet.updated} existing updated
                    {sheet.skipped ? ` · ${sheet.skipped} rejected` : ""}
                  </p>
                </div>
              </div>
            ))}
          {result.sheets.every((sheet) => sheet.imported === 0 && sheet.skipped === 0) ? (
            <p className="py-3 text-sm text-muted-foreground">No rows were submitted for import.</p>
          ) : null}
        </div>
      </DashboardCard>

      <Button className="w-full rounded-xl" size="lg" onClick={onDone}>
        Done
      </Button>
    </div>
  );
}

export function MasterDataImportErrorPanel({
  message,
  onRetry,
  onBackToPreview,
}: {
  message: string;
  onRetry: () => void;
  onBackToPreview: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-md flex-col items-center justify-center gap-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/12 text-destructive">
        <AppIcon name="warning" className="size-7" />
      </div>
      <div>
        <h1 className="text-xl font-semibold text-foreground">Import Failed</h1>
        <p className="mt-1 text-sm text-muted-foreground">{message}</p>
        <p className="mt-1 text-xs text-muted-foreground">Your reviewed preview is still here — you don&apos;t need to start over.</p>
      </div>

      <div className="flex w-full flex-col gap-2 sm:flex-row">
        <Button variant="outline" className="flex-1 rounded-xl" onClick={onBackToPreview}>
          Back to Preview
        </Button>
        <Button className="flex-1 rounded-xl" onClick={onRetry}>
          Try Again
        </Button>
      </div>
    </div>
  );
}
