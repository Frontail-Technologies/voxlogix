import { AppIcon } from "@/components/common/app-icon";
import { cn } from "@/lib/utils";

export type CreateLogStage =
  | "select-module"
  | "select-equipment"
  | "recording"
  | "processing"
  | "review"
  | "attachments"
  | "submitted";

const steps: { stage: CreateLogStage; label: string }[] = [
  { stage: "select-module", label: "Module" },
  { stage: "select-equipment", label: "Equipment" },
  { stage: "recording", label: "Record" },
  { stage: "processing", label: "Process" },
  { stage: "review", label: "Review" },
  { stage: "attachments", label: "Media & Location" },
];

export function CreateLogStepper({ stage, voiceEnabled = true }: { stage: CreateLogStage; voiceEnabled?: boolean }) {
  if (stage === "submitted") {
    return null;
  }

  const visibleSteps = voiceEnabled ? steps : steps.filter((step) => step.stage !== "recording" && step.stage !== "processing");
  const activeIndex = visibleSteps.findIndex((step) => step.stage === stage);

  return (
    <div className="sticky top-0 z-10 rounded-2xl border border-border bg-card/95 px-2 py-3 shadow-sm backdrop-blur sm:px-3">
      <div className={cn("grid items-start gap-1 sm:gap-2", voiceEnabled ? "grid-cols-6" : "grid-cols-4")}>
        {visibleSteps.map((step, index) => {
          const isDone = index < activeIndex;
          const isActive = index === activeIndex;
          const isLineFilled = index < activeIndex;

          return (
            <div key={step.stage} className="relative flex min-w-0 flex-col items-center gap-1.5">
              {index < visibleSteps.length - 1 ? (
                <div
                  className={cn(
                    "absolute left-[calc(50%+18px)] right-[calc(-50%+18px)] top-4 h-0.5 rounded-full transition-colors sm:left-[calc(50%+20px)] sm:right-[calc(-50%+20px)] sm:top-4.5",
                    isLineFilled ? "bg-primary" : "bg-border",
                  )}
                />
              ) : null}
              <div className="relative z-10 flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full transition-all sm:size-9",
                    isDone && "bg-primary text-primary-foreground",
                    isActive &&
                      "bg-primary/12 text-primary ring-2 ring-primary/70 ring-offset-2 ring-offset-card shadow-[0_0_24px_rgba(247,181,30,0.24)]",
                    !isDone && !isActive && "bg-secondary text-muted-foreground",
                  )}
                >
                  {isDone ? (
                    <AppIcon name="status" className="size-4" />
                  ) : (
                    <span className="text-xs font-semibold sm:text-sm">{index + 1}</span>
                  )}
                </div>
                <span
                  className={cn(
                    "max-w-full truncate text-center text-[10px] font-medium leading-tight sm:text-xs",
                    isActive || isDone ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
