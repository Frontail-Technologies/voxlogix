"use client";

import type { ReactNode } from "react";

import { AppIcon, type AppIconName } from "@/components/common/app-icon";
import { DashboardCard } from "@/components/common/dashboard-ui";
import type { EquipmentListItem } from "@/features/admin-equipment/api/equipment.types";
import type { ModuleListItem } from "@/features/master-modules/api/module.types";
import { cn } from "@/lib/utils";

import type { CreateLogStage } from "./create-log-stepper";

type CreateLogWorkspaceProps = {
  stage: CreateLogStage;
  selectedModule: ModuleListItem | null;
  selectedEquipment: EquipmentListItem | null;
  transcript: string;
  voiceDurationSeconds: number;
  children: ReactNode;
};

const stageLabels: Record<CreateLogStage, string> = {
  "select-module": "Choose capture type",
  "select-equipment": "Identify asset",
  recording: "Record field note",
  processing: "AI extraction",
  review: "Review details",
  attachments: "Media and location",
  submitted: "Submitted",
};

export function CreateLogWorkspace({
  stage,
  selectedModule,
  selectedEquipment,
  transcript,
  voiceDurationSeconds,
  children,
}: CreateLogWorkspaceProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem] xl:gap-5">
      <div className="min-w-0 space-y-4 sm:space-y-5">{children}</div>
      <aside className="hidden xl:block">
        <DashboardCard className="sticky top-5">
          <div className="space-y-5 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Live Capture
                </p>
                <h2 className="mt-1 text-base font-semibold text-card-foreground">
                  {stageLabels[stage]}
                </h2>
              </div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/12 text-primary">
                <AppIcon name="ai" className="size-5" />
              </div>
            </div>

            <div className="space-y-3">
              <SummaryRow
                icon="modules"
                label="Module"
                value={selectedModule?.name ?? "Not selected"}
                active={Boolean(selectedModule)}
              />
              <SummaryRow
                icon="equipment"
                label="Equipment"
                value={
                  selectedEquipment
                    ? `${selectedEquipment.equipmentCode} - ${selectedEquipment.name}`
                    : "Waiting for selection"
                }
                active={Boolean(selectedEquipment)}
              />
              <SummaryRow
                icon="voice"
                label="Voice"
                value={voiceDurationSeconds ? `${voiceDurationSeconds}s captured` : "Ready to record"}
                active={voiceDurationSeconds > 0}
              />
              <SummaryRow
                icon="logs"
                label="Transcript"
                value={transcript ? `${transcript.length.toLocaleString()} characters` : "No transcript yet"}
                active={Boolean(transcript)}
              />
            </div>

            <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-card-foreground">
                <AppIcon name="ai" className="size-4 text-primary" />
                Speak naturally
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Mention the asset code, symptom, priority, location, and action taken. AI will structure it in the review step.
              </p>
            </div>
          </div>
        </DashboardCard>
      </aside>
    </div>
  );
}

function SummaryRow({
  icon,
  label,
  value,
  active,
}: {
  icon: AppIconName;
  label: string;
  value: string;
  active: boolean;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-background p-3">
      <div
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-xl",
          active ? "bg-primary/12 text-primary" : "bg-secondary text-muted-foreground",
        )}
      >
        <AppIcon name={icon} className="size-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="mt-0.5 line-clamp-2 text-sm font-medium text-card-foreground">{value}</p>
      </div>
    </div>
  );
}
