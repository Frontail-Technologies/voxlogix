"use client";

import { useEffect, useState } from "react";

import { AppIcon } from "@/components/common/app-icon";
import { DashboardCard } from "@/components/common/dashboard-ui";

// The commit endpoint processes every sheet in a single request and doesn't stream
// per-sheet progress today (real progress would need SSE/polling infrastructure that
// doesn't exist yet and isn't justified for this alone). So this deliberately does NOT fake
// a percentage or claim any specific sheet/record count has finished before the server
// actually responds — it only cycles through honest, deterministic stage copy and an
// indeterminate progress rail while blocking interaction. The moment the real response
// lands, this is replaced by the actual per-sheet created/updated/skipped counts on the
// success screen.
const STAGES = ["Validating data...", "Preparing records...", "Importing master data...", "Refreshing company data..."];

export function MasterDataImportProgressOverlay() {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((current) => Math.min(current + 1, STAGES.length - 1));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    // `absolute inset-0` against the `relative` wrapper the wizard renders around the
    // preview panel — not `fixed inset-0`, which would size against the viewport and cover
    // the sidebar. This only ever covers the main-content area this feature owns.
    // A warm translucent backdrop (the same --background token the page already uses, just
    // partly see-through) rather than blur or a flat white sheet, so the preview page stays
    // faintly visible underneath instead of vanishing behind glass.
    <div
      className="absolute inset-0 z-30 flex items-center justify-center bg-background/92 p-4"
      role="alertdialog"
      aria-busy="true"
      aria-live="polite"
    >
      <DashboardCard className="w-full max-w-sm p-7 text-center sm:p-8">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/14 text-icon-strong">
          <AppIcon name="database" className="size-7 animate-pulse" />
        </div>
        <h2 className="mt-5 text-lg font-semibold text-foreground">Importing Master Data</h2>
        <p className="mt-2 text-sm leading-5 text-muted-foreground">
          Please keep this page open while we finish importing your records.
        </p>

        <div className="mt-6">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full w-1/3 rounded-full bg-primary animate-progress-indeterminate" />
          </div>
          <p className="mt-3 text-sm font-medium text-foreground" aria-live="polite">
            {STAGES[stageIndex]}
          </p>
        </div>
      </DashboardCard>
    </div>
  );
}
