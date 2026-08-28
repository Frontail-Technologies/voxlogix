"use client";

import { AppIcon } from "@/components/common/app-icon";
import { TrendAreaChart } from "@/components/common/trend-area-chart";
import { StatusBadge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/common/dashboard-ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useReadingHistory } from "@/features/imported-master-data/api/imported-master-data.queries";
import type {
  ImportedMasterDataItem,
  MeasuringPointReadingHistoryItem,
  MeterCounterReadingHistoryItem,
} from "@/features/imported-master-data/api/imported-master-data.types";
import { formatMasterDataDate } from "@/features/admin-master-data/master-data.presentation";

type HistorySource = "measuringPoints" | "meterCounters";

function itemIdentity(source: HistorySource, item: ImportedMasterDataItem) {
  if (source === "measuringPoints" && "measurementName" in item) {
    return { title: item.measurementName, code: item.pointCode, unit: item.measurementUnit };
  }
  if (source === "meterCounters" && "counterName" in item) {
    return { title: item.counterName, code: item.counterCode, unit: item.counterUnit };
  }
  return { title: "Record", code: "", unit: "" };
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
  const query = useReadingHistory<MeasuringPointReadingHistoryItem | MeterCounterReadingHistoryItem>(source, item.id);
  const readings = query.data?.data ?? [];

  const chartPoints = [...readings]
    .reverse()
    .map((reading) => ({
      label: formatMasterDataDate(reading.reportedAt),
      value: "measuredValue" in reading ? reading.measuredValue : reading.currentReading,
    }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AppIcon name="reports" className="size-4" />
            {identity.title}
          </DialogTitle>
          <DialogDescription>
            {identity.code ? `${identity.code} · ` : ""}
            Recent readings{identity.unit ? ` (${identity.unit})` : ""}
          </DialogDescription>
        </DialogHeader>

        {query.isLoading ? (
          <div className="py-8 text-center text-sm text-muted-foreground">Loading history…</div>
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {readings.map((reading) => {
                    const value = "measuredValue" in reading ? reading.measuredValue : reading.currentReading;
                    const status = "measurementStatus" in reading ? reading.measurementStatus : reading.counterStatus;
                    return (
                      <TableRow key={reading.id}>
                        <TableCell className="text-muted-foreground">{formatMasterDataDate(reading.reportedAt)}</TableCell>
                        <TableCell className="font-medium text-foreground">
                          {value}
                          {identity.unit ? <span className="ml-1 text-xs text-muted-foreground">{identity.unit}</span> : null}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={reading.isAlert ? `Alert · ${status}` : status} />
                        </TableCell>
                        <TableCell className="text-muted-foreground">{reading.reportedBy?.fullName ?? "-"}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
