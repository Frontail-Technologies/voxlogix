"use client";

import { type ReactNode } from "react";

import { AppIcon } from "@/components/common/app-icon";
import {
  CardContent,
  CardHeader,
  CardTitle,
  DashboardCard,
  DashboardPageHeader,
} from "@/components/common/dashboard-ui";
import { MasterDetailSkeleton } from "@/components/master/master-skeletons";
import { useLogDetail } from "@/features/logs/api/log.queries";
import type { AdminLogDetail } from "@/features/logs/api/log.types";
import {
  fieldValueLabel,
  formatLogDate,
  formatMinutes,
  formatSeconds,
  logLabel,
} from "@/features/logs/log.presentation";

import { LogStatusBadge, SeverityBadge } from "../../admin/logs/log-badges";

export function MyLogDetailView({ logId }: { logId: string }) {
  const { data, isLoading, isError } = useLogDetail(logId);
  const log = data?.data;

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader
        title="Log Detail"
        description="Log summary, AI extracted fields, transcript, and media"
        hideDescriptionOnMobile
      />

      {isLoading ? <MasterDetailSkeleton /> : null}
      {isError ? (
        <DashboardCard>
          <p className="p-5 text-sm text-muted-foreground">Could not load log detail.</p>
        </DashboardCard>
      ) : null}
      {log ? (
        <div className="space-y-3 sm:space-y-4">
          <LogOverviewCard log={log} />
          <AiFieldsCard log={log} />
          <TranscriptCard log={log} />
          <MediaCard log={log} />
          <TimelineCard log={log} />
        </div>
      ) : null}
    </div>
  );
}

function LogOverviewCard({ log }: { log: AdminLogDetail }) {
  return (
    <DashboardCard>
      <CardContent className="space-y-4 p-4 sm:space-y-6 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold sm:text-xl">{log.logNumber}</h2>
              <LogStatusBadge status={log.status} />
              <SeverityBadge severity={log.severity} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{log.title}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <Stat label="Created" value={formatLogDate(log.createdAt)} />
          <Stat label="Created By" value={log.createdBy.fullName ?? "System"} />
          <Stat label="Module" value={log.module?.name ?? logLabel(log.moduleType)} />
          <Stat label="Downtime" value={formatMinutes(log.downtimeMinutes)} />
        </div>

        <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
          <InfoBlock title="Equipment">
            <InfoRow label="Name" value={log.equipment?.name ?? "General activity"} />
            <InfoRow label="ID" value={log.equipment?.equipmentCode} />
            <InfoRow label="Section" value={log.equipment?.section} />
            <InfoRow label="Sub Location" value={log.equipment?.subLocation} />
          </InfoBlock>
          <InfoBlock title="Location Captured">
            <InfoRow label="Address" value={log.capturedAddress} />
            <InfoRow label="Latitude" value={log.capturedLatitude} />
            <InfoRow label="Longitude" value={log.capturedLongitude} />
            <InfoRow label="Voice Time" value={formatSeconds(log.voiceDurationSeconds)} />
          </InfoBlock>
        </div>

        <div className="rounded-2xl border border-border bg-background p-3 sm:p-4">
          <h3 className="font-semibold">Description</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {log.description || "No description added."}
          </p>
        </div>
      </CardContent>
    </DashboardCard>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-3 sm:p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold sm:text-base">{value}</p>
    </div>
  );
}

function InfoBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-3 sm:p-4">
      <h3 className="font-semibold">{title}</h3>
      <div className="mt-3 space-y-2 text-sm">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <p>
      <span className="text-muted-foreground">{label}:</span> {value || "-"}
    </p>
  );
}

function AiFieldsCard({ log }: { log: AdminLogDetail }) {
  const fields = Object.entries(log.extractedFields ?? {});

  return (
    <DashboardCard>
      <CardHeader className="flex flex-row items-center gap-2 px-4 py-3 sm:px-5 sm:py-4">
        <AppIcon name="ai" className="size-4 text-primary" />
        <CardTitle>AI Extracted Fields</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 px-4 pb-4 pt-1 sm:gap-4 sm:px-5 sm:pb-5 sm:pt-2 lg:grid-cols-2">
        {fields.length ? (
          fields.map(([key, value]) => (
            <FieldBlock key={key} label={logLabel(key)} value={fieldValueLabel(value)} />
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No AI fields saved yet.</p>
        )}
      </CardContent>
    </DashboardCard>
  );
}

function FieldBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-3 sm:p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm text-foreground">{value}</p>
    </div>
  );
}

function TranscriptCard({ log }: { log: AdminLogDetail }) {
  return (
    <DashboardCard>
      <CardHeader className="px-4 py-3 sm:px-5 sm:py-4">
        <CardTitle>Transcript</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-1 sm:px-5 sm:pb-5 sm:pt-2">
        <p className="rounded-2xl border border-border bg-background p-3 text-sm italic leading-6 text-muted-foreground sm:p-4">
          {log.transcript || "No transcript saved for this log."}
        </p>
      </CardContent>
    </DashboardCard>
  );
}

function MediaCard({ log }: { log: AdminLogDetail }) {
  return (
    <DashboardCard>
      <CardHeader className="px-4 py-3 sm:px-5 sm:py-4">
        <CardTitle>Media</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-1 sm:px-5 sm:pb-5 sm:pt-2">
        {log.attachments.length ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {log.attachments.map((attachment) => (
              <a
                key={attachment.id}
                href={attachment.url}
                target="_blank"
                rel="noreferrer"
                className="overflow-hidden rounded-2xl border border-border bg-background"
              >
                {attachment.mimeType?.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={attachment.url}
                    alt={attachment.label ?? attachment.fileName ?? "Log attachment"}
                    className="aspect-[4/3] w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[4/3] items-center justify-center">
                    <AppIcon name="image" className="size-7 text-muted-foreground" />
                  </div>
                )}
                <p className="truncate px-3 py-2 text-xs text-muted-foreground">
                  {attachment.label ?? attachment.fileName ?? "Attachment"}
                </p>
              </a>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-secondary/40 px-4 py-8 text-center">
            <AppIcon name="image" className="size-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No media attached to this log.</p>
          </div>
        )}
      </CardContent>
    </DashboardCard>
  );
}

function TimelineCard({ log }: { log: AdminLogDetail }) {
  return (
    <DashboardCard>
      <CardHeader className="px-4 py-3 sm:px-5 sm:py-4">
        <CardTitle>Timeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 px-4 pb-4 pt-1 sm:px-5 sm:pb-5 sm:pt-2">
        {log.timeline.length ? (
          log.timeline.map((event) => (
            <div key={event.id} className="rounded-2xl border border-border bg-background p-3 sm:p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium text-foreground">{event.event}</p>
                <span className="text-xs text-muted-foreground">{formatLogDate(event.createdAt)}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">by {event.actorNameSnapshot}</p>
              {event.status ? (
                <div className="mt-2">
                  <LogStatusBadge status={event.status} />
                </div>
              ) : null}
              {event.notes ? <p className="mt-2 text-sm text-muted-foreground">{event.notes}</p> : null}
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No timeline events yet.</p>
        )}
      </CardContent>
    </DashboardCard>
  );
}
