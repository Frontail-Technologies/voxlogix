"use client";

import { useState } from "react";

import { AppIcon } from "@/components/common/app-icon";
import { TrendAreaChart } from "@/components/common/trend-area-chart";
import { StatusBadge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/common/dashboard-ui";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { formatMasterDataDate } from "@/features/admin-master-data/master-data.presentation";
import { useInvalidateReading, useReadingHistory } from "@/features/imported-master-data/api/imported-master-data.queries";
import type {
  ImportedMasterDataItem,
  MeasuringPointReadingHistoryItem,
  MeterCounterReadingHistoryItem,
} from "@/features/imported-master-data/api/imported-master-data.types";

type HistorySource = "measuringPoints" | "meterCounters";
type ReadingHistoryItem = MeasuringPointReadingHistoryItem | MeterCounterReadingHistoryItem;

function itemIdentity(source: HistorySource, item: ImportedMasterDataItem) {
  if (source === "measuringPoints" && "measurementName" in item) {
    return { title: item.measurementName, code: item.pointCode, unit: item.measurementUnit };
  }
  if (source === "meterCounters" && "counterName" in item) {
    return { title: item.counterName, code: item.counterCode, unit: item.counterUnit };
  }
  return { title: "Record", code: "", unit: "" };
}

function readingValue(reading: ReadingHistoryItem) {
  return "measuredValue" in reading ? reading.measuredValue : reading.currentReading;
}

function readingStatus(reading: ReadingHistoryItem) {
  return "measurementStatus" in reading ? reading.measurementStatus : reading.counterStatus;
}

export function ImportedMasterDataHistoryDialog({
  source,
  item,
  open,
  onOpenChange,
}: {
  source: HistorySource;
  item: ImportedMasterDataItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const identity = itemIdentity(source, item);
  const query = useReadingHistory<ReadingHistoryItem>(source, item.id);
  const invalidateMutation = useInvalidateReading();
  const [invalidateTarget, setInvalidateTarget] = useState<ReadingHistoryItem | null>(null);
  const [reason, setReason] = useState("");
  const readings = query.data?.data ?? [];

  const chartPoints = [...readings]
    .filter((reading) => reading.status !== "INVALID")
    .reverse()
    .map((reading) => ({
      label: formatMasterDataDate(reading.reportedAt),
      value: readingValue(reading),
    }));

  async function submitInvalidation() {
    if (!invalidateTarget || !reason.trim()) return;

    await invalidateMutation.mutateAsync({
      source,
      itemId: item.id,
      readingId: invalidateTarget.id,
      reason,
    });
    setInvalidateTarget(null);
    setReason("");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AppIcon name="reports" className="size-4" />
            {identity.title}
          </DialogTitle>
          <DialogDescription>
            {identity.code ? `${identity.code} - ` : ""}
            Recent readings{identity.unit ? ` (${identity.unit})` : ""}
          </DialogDescription>
        </DialogHeader>

        {query.isLoading ? (
          <div className="py-8 text-center text-sm text-muted-foreground">Loading history...</div>
        ) : readings.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">No readings recorded yet.</div>
        ) : (
          <div className="space-y-4">
            <TrendAreaChart points={chartPoints} />
            <div className="max-h-64 overflow-y-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reported</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>By</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {readings.map((reading) => {
                    const value = readingValue(reading);
                    const status = readingStatus(reading);
                    const isInvalid = reading.status === "INVALID";

                    return (
                      <TableRow key={reading.id} className={isInvalid ? "bg-muted/35" : undefined}>
                        <TableCell className="text-muted-foreground">{formatMasterDataDate(reading.reportedAt)}</TableCell>
                        <TableCell className={isInvalid ? "font-medium text-muted-foreground" : "font-medium text-foreground"}>
                          {value}
                          {identity.unit ? <span className="ml-1 text-xs text-muted-foreground">{identity.unit}</span> : null}
                          {isInvalid ? (
                            <div className="mt-1 space-y-0.5 text-xs font-normal text-muted-foreground">
                              <div>Invalid reading</div>
                              <div>
                                Invalidated{reading.invalidatedBy?.fullName ? ` by ${reading.invalidatedBy.fullName}` : ""}
                                {reading.invalidatedAt ? ` - ${formatMasterDataDate(reading.invalidatedAt)}` : ""}
                              </div>
                              {reading.invalidationReason ? <div>Reason: {reading.invalidationReason}</div> : null}
                            </div>
                          ) : null}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={isInvalid ? "Invalid" : reading.isAlert ? `Alert - ${status}` : status} />
                        </TableCell>
                        <TableCell className="text-muted-foreground">{reading.reportedBy?.fullName ?? "-"}</TableCell>
                        <TableCell className="text-right">
                          {!isInvalid ? (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setInvalidateTarget(reading);
                                setReason("");
                              }}
                            >
                              Invalidate
                            </Button>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            {invalidateTarget ? (
              <div className="rounded-lg border border-border bg-secondary/40 p-3">
                <div className="text-sm font-medium text-foreground">Invalidate this reading?</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  This reading will remain in history but will be excluded from operational calculations and alerts.
                </p>
                <Textarea
                  className="mt-3"
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  placeholder="Reason, e.g. Wrong value entered"
                  maxLength={500}
                />
                <div className="mt-3 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setInvalidateTarget(null);
                      setReason("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    disabled={!reason.trim() || invalidateMutation.isPending}
                    onClick={submitInvalidation}
                  >
                    {invalidateMutation.isPending ? "Invalidating..." : "Invalidate Reading"}
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
