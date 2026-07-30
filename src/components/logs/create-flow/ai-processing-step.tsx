"use client";

import { useEffect, useRef, useState } from "react";

import { AppIcon } from "@/components/common/app-icon";
import { CardContent, CardHeader, CardTitle, DashboardCard } from "@/components/common/dashboard-ui";
import { Button } from "@/components/ui/button";
import { extractLogFields } from "@/features/logs/api/ai.mutations";
import type { ExtractedLogFields } from "@/features/logs/api/ai.types";
import { showApiErrorToast } from "@/lib/api/error-toast";
import { cn } from "@/lib/utils";

const PROCESSING_STEPS = [
  "Reading transcript",
  "Matching module schema",
  "Extracting AI field values",
  "Preparing review",
];

const STEP_INTERVAL_MS = 750;
const COMPLETE_DELAY_MS = 450;

type AiProcessingStepProps = {
  transcript: string;
  moduleId: string;
  equipmentId?: string | null;
  onComplete: (fields: ExtractedLogFields) => void;
  onSkip: () => void;
};

export function AiProcessingStep({ transcript, moduleId, equipmentId, onComplete, onSkip }: AiProcessingStepProps) {
  const requestKeyRef = useRef<string | null>(null);
  const onCompleteRef = useRef(onComplete);
  const completeTimerRef = useRef<number | null>(null);
  const [visibleStep, setVisibleStep] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const requestKey = `${moduleId}:${equipmentId ?? ""}:${transcript}:${attempt}`;

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (requestKeyRef.current === requestKey) return;

    let cancelled = false;
    requestKeyRef.current = requestKey;
    setHasError(false);
    setVisibleStep(0);

    if (completeTimerRef.current) {
      window.clearTimeout(completeTimerRef.current);
      completeTimerRef.current = null;
    }

    const interval = window.setInterval(() => {
      setVisibleStep((current) => Math.min(current + 1, PROCESSING_STEPS.length - 2));
    }, STEP_INTERVAL_MS);

    async function processLog() {
      try {
        const response = await extractLogFields({ transcript, moduleId, equipmentId });

        if (cancelled) return;

        window.clearInterval(interval);
        setVisibleStep(PROCESSING_STEPS.length - 1);
        completeTimerRef.current = window.setTimeout(() => {
          if (!cancelled) {
            onCompleteRef.current(response.data ?? {});
          }
        }, COMPLETE_DELAY_MS);
      } catch (error) {
        if (cancelled) return;

        window.clearInterval(interval);
        setHasError(true);
        showApiErrorToast(error, "Could not extract log details from the transcript");
      }
    }

    void processLog();

    return () => {
      cancelled = true;
      if (requestKeyRef.current === requestKey) {
        requestKeyRef.current = null;
      }
      window.clearInterval(interval);
      if (completeTimerRef.current) {
        window.clearTimeout(completeTimerRef.current);
        completeTimerRef.current = null;
      }
    };
  }, [requestKey, transcript, moduleId, equipmentId]);

  function retry() {
    requestKeyRef.current = null;
    setHasError(false);
    setVisibleStep(0);
    setAttempt((value) => value + 1);
  }

  if (hasError) {
    return (
      <DashboardCard>
      <CardHeader className="flex flex-row items-center gap-2 border-b border-border/70 px-4 py-4 sm:px-5">
        <div className="flex size-10 items-center justify-center rounded-xl bg-destructive/12 text-destructive">
          <AppIcon name="ai" className="size-5" />
        </div>
        <CardTitle>AI extraction failed</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-4 py-5 sm:px-5">
          <p className="text-sm text-muted-foreground">
            We could not process the transcript with AI right now. You can try again or fill the log details in manually.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button type="button" className="rounded-xl" onClick={retry}>
              Retry
            </Button>
            <Button type="button" variant="outline" className="rounded-xl" onClick={onSkip}>
              Skip AI, fill manually
            </Button>
          </div>
        </CardContent>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard>
      <CardHeader className="border-b border-border/70 px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/12 text-primary">
              <AppIcon name="ai" className="size-5" />
            </div>
            <div>
              <CardTitle>Processing Your Log</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                AI is structuring the transcript into module fields.
              </p>
            </div>
          </div>
          <div className="hidden rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-xs font-medium text-muted-foreground sm:block">
            Step {visibleStep + 1} of {PROCESSING_STEPS.length}
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-5 px-4 py-5 sm:px-5 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <div className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-primary/20 bg-gradient-to-b from-primary/12 to-background p-6 text-center">
          <div className="relative flex size-24 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25">
            <span className="absolute inset-[-12px] animate-ping rounded-full border border-primary/30" />
            <span className="absolute inset-[-24px] animate-pulse rounded-full border border-primary/15" />
            <AppIcon name="ai" className="relative size-10" />
          </div>
          <h3 className="mt-6 text-base font-semibold text-foreground">AI is working</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Values will appear on the review screen as editable fields.
          </p>
        </div>

        <div className="space-y-3">
          {PROCESSING_STEPS.map((label, index) => {
            const isDone = index < visibleStep;
            const isActive = index === visibleStep;

            return (
              <div
                key={label}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border p-4 transition-all",
                  isActive ? "border-primary/40 bg-primary/6 shadow-sm" : "border-border bg-background",
                )}
              >
                <div
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full",
                    isDone && "bg-emerald-500/12 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300",
                    isActive && "bg-primary/15 text-primary",
                    !isDone && !isActive && "bg-secondary text-muted-foreground",
                  )}
                >
                  {isDone ? (
                    <AppIcon name="status" className="size-4" />
                  ) : isActive ? (
                    <span className="size-3.5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  ) : (
                    <span className="size-2 rounded-full bg-current" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isDone || isActive ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {label}
                  </p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div
                      className={cn(
                        "h-full rounded-full bg-primary transition-all duration-500",
                        isDone ? "w-full" : isActive ? "w-2/3" : "w-0",
                      )}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </DashboardCard>
  );
}


