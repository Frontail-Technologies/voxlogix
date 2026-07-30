"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateLog } from "@/features/logs/api/log.mutations";
import { useLogDetail } from "@/features/logs/api/log.queries";
import type { AdminLogDetail } from "@/features/logs/api/log.types";
import { showApiErrorToast } from "@/lib/api/error-toast";

type DraftFields = {
  title: string;
  problemDescription: string;
  failureMode: string;
  rootCause: string;
  actionTaken: string;
  downtimeMinutes: number;
  sparePartReference: string;
  pendingWork: string;
  notes: string;
};

function fieldsFromLog(log: AdminLogDetail): DraftFields {
  const extracted = log.extractedFields ?? {};
  const stringField = (key: string) => (typeof extracted[key] === "string" ? (extracted[key] as string) : "");

  return {
    title: log.title,
    problemDescription: log.description ?? "",
    failureMode: stringField("failureMode"),
    rootCause: stringField("rootCause"),
    actionTaken: stringField("actionTaken"),
    downtimeMinutes: log.downtimeMinutes,
    sparePartReference: stringField("sparePartReference"),
    pendingWork: stringField("pendingWork"),
    notes: stringField("notes"),
  };
}

export function EditDraftLogView({ logId }: { logId: string }) {
  const { data, isLoading, isError } = useLogDetail(logId);
  const log = data?.data;

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader title="Edit Draft" description="Continue editing this draft log before submitting it." />

      {isLoading ? <MasterDetailSkeleton /> : null}
      {isError ? (
        <DashboardCard>
          <p className="p-5 text-sm text-muted-foreground">Could not load this draft.</p>
        </DashboardCard>
      ) : null}

      {log ? <DraftForm key={log.id} logId={logId} log={log} /> : null}
    </div>
  );
}

function DraftForm({ logId, log }: { logId: string; log: AdminLogDetail }) {
  const router = useRouter();
  const updateMutation = useUpdateLog(logId);
  const [fields, setFields] = useState<DraftFields>(() => fieldsFromLog(log));

  function updateField<K extends keyof DraftFields>(key: K, value: DraftFields[K]) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  async function submit(status: "SUBMITTED" | "DRAFT") {
    try {
      await updateMutation.mutateAsync({
        title: fields.title,
        description: fields.problemDescription,
        status,
        downtimeMinutes: fields.downtimeMinutes,
        extractedFields: {
          failureMode: fields.failureMode,
          rootCause: fields.rootCause,
          actionTaken: fields.actionTaken,
          sparePartReference: fields.sparePartReference,
          pendingWork: fields.pendingWork,
          notes: fields.notes,
        },
      });

      toast.success(status === "DRAFT" ? "Draft updated" : "Log submitted");
      router.push(status === "DRAFT" ? "/execution/my-logs" : `/execution/my-logs/${logId}`);
    } catch (error) {
      showApiErrorToast(error, "Could not update draft");
    }
  }

  return (
    <DashboardCard>
      <CardHeader className="px-4 py-3 sm:px-5 sm:py-4">
        <CardTitle>Draft Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-4 pb-4 pt-1 sm:px-5 sm:pb-5 sm:pt-2">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            value={fields.title}
            onChange={(event) => updateField("title", event.target.value)}
            className="h-11 rounded-xl bg-secondary/70"
          />
        </div>
        <div className="space-y-2">
          <Label>Problem Description</Label>
          <Textarea
            value={fields.problemDescription}
            onChange={(event) => updateField("problemDescription", event.target.value)}
            className="min-h-20 rounded-xl bg-secondary/70"
          />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <Label>Failure Mode</Label>
            <Input
              value={fields.failureMode}
              onChange={(event) => updateField("failureMode", event.target.value)}
              className="h-11 rounded-xl bg-secondary/70"
            />
          </div>
          <div className="space-y-2">
            <Label>Downtime (minutes)</Label>
            <Input
              type="number"
              value={fields.downtimeMinutes}
              onChange={(event) => updateField("downtimeMinutes", Number(event.target.value))}
              className="h-11 rounded-xl bg-secondary/70"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Root Cause</Label>
          <Textarea
            value={fields.rootCause}
            onChange={(event) => updateField("rootCause", event.target.value)}
            className="min-h-20 rounded-xl bg-secondary/70"
          />
        </div>
        <div className="space-y-2">
          <Label>Action Taken</Label>
          <Textarea
            value={fields.actionTaken}
            onChange={(event) => updateField("actionTaken", event.target.value)}
            className="min-h-20 rounded-xl bg-secondary/70"
          />
        </div>
        <div className="space-y-2">
          <Label>Spare Part Reference</Label>
          <Input
            value={fields.sparePartReference}
            onChange={(event) => updateField("sparePartReference", event.target.value)}
            className="h-11 rounded-xl bg-secondary/70"
          />
        </div>
        <div className="space-y-2">
          <Label>Pending Work</Label>
          <Textarea
            value={fields.pendingWork}
            onChange={(event) => updateField("pendingWork", event.target.value)}
            className="min-h-20 rounded-xl bg-secondary/70"
          />
        </div>
        <div className="space-y-2">
          <Label>Notes</Label>
          <Textarea
            value={fields.notes}
            onChange={(event) => updateField("notes", event.target.value)}
            className="min-h-20 rounded-xl bg-secondary/70"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" className="rounded-xl" onClick={() => void submit("SUBMITTED")} disabled={updateMutation.isPending}>
            <AppIcon name="status" className="size-4" />
            Submit Log
          </Button>
          <Button type="button" variant="outline" className="rounded-xl" onClick={() => void submit("DRAFT")} disabled={updateMutation.isPending}>
            Save Draft
          </Button>
        </div>
      </CardContent>
    </DashboardCard>
  );
}
