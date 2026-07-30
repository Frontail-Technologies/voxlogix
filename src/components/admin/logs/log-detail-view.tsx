"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";

import { AppIcon } from "@/components/common/app-icon";
import {
  CardContent,
  CardHeader,
  CardTitle,
  DashboardCard,
  DashboardPageHeader,
} from "@/components/common/dashboard-ui";
import { MasterDetailSkeleton } from "@/components/master/master-skeletons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUpdateLogStatus } from "@/features/logs/api/log.mutations";
import { useLogDetail } from "@/features/logs/api/log.queries";
import type { AdminLogDetail } from "@/features/logs/api/log.types";
import {
  fieldValueLabel,
  formatLogDate,
  formatMinutes,
  logLabel,
  logStatuses,
} from "@/features/logs/log.presentation";
import { showApiErrorToast } from "@/lib/api/error-toast";
import { cn } from "@/lib/utils";

import { LogStatusBadge, SeverityBadge } from "./log-badges";

export function LogDetailView({ logId }: { logId: string }) {
  const { data, isLoading, isError } = useLogDetail(logId);
  const log = data?.data;

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader
        title="Log Detail"
        description="Log summary, AI extracted fields, transcript, media, and timeline"
        hideDescriptionOnMobile
      />

      {isLoading ? <MasterDetailSkeleton /> : null}
      {isError ? (
        <DashboardCard>
          <p className="p-5 text-sm text-muted-foreground">
            Could not load log detail.
          </p>
        </DashboardCard>
      ) : null}
      {log ? (
        <div className="grid items-start gap-3 sm:gap-4 xl:grid-cols-[1fr_320px]">
          <div className="space-y-3 sm:space-y-4">
            <LogOverviewCard log={log} />
            <AiFieldsCard log={log} />
            <TranscriptCard log={log} />
            <MediaCard log={log} />
            <TimelineCard log={log} />
          </div>
          <LogQuickActions log={log} />
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
            <LocationMap latitude={log.capturedLatitude} longitude={log.capturedLongitude} />
          </InfoBlock>
        </div>

        <div className="rounded-2xl border border-border bg-background p-3 sm:p-4">
          <h3 className="font-semibold">Description</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {log.description || "No description added."}
          </p>
        </div>

        {log.voiceRecordingUrl ? (
          <div className="rounded-2xl border border-border bg-background p-3 sm:p-4">
            <h3 className="font-semibold">Voice Recording</h3>
            <audio controls src={log.voiceRecordingUrl} className="mt-3 w-full">
              Your browser does not support audio playback.
            </audio>
          </div>
        ) : null}
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
      <div className="mt-3 space-y-3 text-sm">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{value || "-"}</span>
    </div>
  );
}

function LocationMap({ latitude, longitude }: { latitude?: string | null; longitude?: string | null }) {
  if (!latitude || !longitude) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <iframe
        title="Captured location map"
        src={`https://www.google.com/maps?q=${latitude},${longitude}&output=embed`}
        className="h-40 w-full"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
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
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  function toggleSpeech() {
    if (!log.transcript) return;

    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      toast.error("Text-to-speech is not supported in this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(log.transcript);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  }

  return (
    <DashboardCard>
      <CardHeader className="flex flex-row items-center justify-between px-4 py-3 sm:px-5 sm:py-4">
        <CardTitle>Transcript</CardTitle>
        {log.transcript ? (
          <Button type="button" variant="outline" size="sm" className="rounded-xl" onClick={toggleSpeech}>
            <AppIcon name={isSpeaking ? "stop" : "speaker"} className="size-4" />
            {isSpeaking ? "Stop" : "Listen"}
          </Button>
        ) : null}
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
  const [attachmentsOpen, setAttachmentsOpen] = useState(false);
  const imageCount = log.attachments.filter((attachment) => attachment.mimeType?.startsWith("image/")).length;

  return (
    <DashboardCard>
      <CardHeader className="flex flex-row items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4">
        <div className="flex items-center gap-2">
          <AppIcon name="image" className="size-4 text-primary" />
          <CardTitle>Media</CardTitle>
        </div>
        {log.attachments.length ? (
          <button
            type="button"
            onClick={() => setAttachmentsOpen(true)}
            className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            aria-label="View attachments"
          >
            <AppIcon name="eye" className="size-4" />
          </button>
        ) : null}
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-1 sm:px-5 sm:pb-5 sm:pt-2">
        {log.attachments.length ? (
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background p-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
                <AppIcon name="image" className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {log.attachments.length} attachment{log.attachments.length === 1 ? "" : "s"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {imageCount} image{imageCount === 1 ? "" : "s"} attached. Use preview to view or download files.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAttachmentsOpen(true)}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-border bg-secondary/70 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
            >
              <AppIcon name="eye" className="size-4" />
              Preview
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-secondary/40 px-4 py-8 text-center">
            <AppIcon name="image" className="size-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No media attached to this log.</p>
          </div>
        )}
      </CardContent>

      {attachmentsOpen ? (
        <Dialog open={attachmentsOpen} onOpenChange={setAttachmentsOpen}>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Log Attachments</DialogTitle>
            </DialogHeader>
            <div className="grid max-h-[70vh] gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
              {log.attachments.map((attachment) => {
                const isImage = attachment.mimeType?.startsWith("image/");

                return (
                  <div key={attachment.id} className="overflow-hidden rounded-2xl border border-border bg-background">
                    <div className="flex aspect-4/3 items-center justify-center bg-secondary/40">
                      {isImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={attachment.url}
                          alt={attachment.label ?? attachment.fileName ?? "Log attachment"}
                          className="size-full object-contain"
                        />
                      ) : (
                        <AppIcon name="image" className="size-7 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-2 px-3 py-2">
                      <p className="min-w-0 truncate text-xs text-muted-foreground">
                        {attachment.label ?? attachment.fileName ?? "Attachment"}
                      </p>
                      <a
                        href={attachment.url}
                        download={attachment.fileName ?? undefined}
                        className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        aria-label="Download attachment"
                      >
                        <AppIcon name="download" className="size-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
      ) : null}
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
            <div
              key={event.id}
              className="rounded-2xl border border-border bg-background p-3 sm:p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium text-foreground">{event.event}</p>
                <span className="text-xs text-muted-foreground">
                  {formatLogDate(event.createdAt)}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                by {event.actorNameSnapshot}
              </p>
              {event.status ? (
                <div className="mt-2"><LogStatusBadge status={event.status} /></div>
              ) : null}
              {event.notes ? (
                <p className="mt-2 text-sm text-muted-foreground">{event.notes}</p>
              ) : null}
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No timeline events yet.</p>
        )}
      </CardContent>
    </DashboardCard>
  );
}

function LogQuickActions({ log }: { log: AdminLogDetail }) {
  const statusMutation = useUpdateLogStatus(log.id);
  const equipmentId = log.equipment?.id;

  async function updateStatus(status: string) {
    try {
      await statusMutation.mutateAsync({ status });
      toast.success(`${log.logNumber} marked ${logLabel(status)}`);
    } catch (error) {
      showApiErrorToast(error, "Could not update log status");
    }
  }

  const statusSelect = (
    <Select value={log.status} onValueChange={(value) => value && void updateStatus(value)}>
      <SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70" disabled={statusMutation.isPending}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {logStatuses.map((status) => (
          <SelectItem key={status.value} value={status.value}>
            {status.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const links = (
    <>
      <Link
        href={`/admin/logs/${log.id}/edit`}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-14 flex-col gap-1 rounded-xl px-1 text-xs xl:h-11 xl:w-full xl:flex-row xl:justify-start xl:gap-2 xl:px-4",
        )}
      >
        <AppIcon name="settings" className="size-4" />
        Edit Log
      </Link>
      {equipmentId ? (
        <Link
          href={`/admin/equipment/${equipmentId}`}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-14 flex-col gap-1 rounded-xl px-1 text-xs xl:h-11 xl:w-full xl:flex-row xl:justify-start xl:gap-2 xl:px-4",
          )}
        >
          <AppIcon name="equipment" className="size-4" />
          Equipment
        </Link>
      ) : null}
    </>
  );

  return (
    <>
      <div className="order-first space-y-2 xl:hidden">
        {statusSelect}
        <div className="grid grid-cols-2 gap-2">{links}</div>
      </div>

      <DashboardCard className="hidden xl:sticky xl:top-6 xl:block">
        <CardContent className="space-y-3 p-5">
          <h3 className="font-semibold">Quick Actions</h3>
          {statusSelect}
          {links}
        </CardContent>
      </DashboardCard>
    </>
  );
}
