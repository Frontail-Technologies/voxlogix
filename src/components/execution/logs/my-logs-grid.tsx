"use client";

import Link from "next/link";

import { DashboardCard } from "@/components/common/dashboard-ui";
import { TruncatedText } from "@/components/common/truncated-text";
import type { AdminLogListItem } from "@/features/logs/api/log.types";
import { formatLogDate, logLabel } from "@/features/logs/log.presentation";

import { LogStatusBadge, SeverityBadge } from "../../admin/logs/log-badges";

export function MyLogsGrid({ logs }: { logs: AdminLogListItem[] }) {
  if (!logs.length) {
    return (
      <DashboardCard>
        <p className="p-8 text-center text-sm text-muted-foreground">No logs found.</p>
      </DashboardCard>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {logs.map((log) => {
        const equipment = log.equipment;

        return (
          <Link key={log.id} href={`/execution/my-logs/${log.id}`}>
            <DashboardCard className="h-full space-y-3 p-4 transition-colors hover:border-primary/50">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <TruncatedText text={log.title} className="font-medium text-foreground" />
                  <p className="text-xs text-muted-foreground">{log.logNumber}</p>
                </div>
                <LogStatusBadge status={log.status} />
              </div>
              <div className="text-sm text-muted-foreground">
                {equipment?.name ? (
                  <p>
                    {equipment.name} - {equipment.equipmentCode ?? "-"}
                  </p>
                ) : (
                  <p>General activity</p>
                )}
                <p>{logLabel(log.moduleType)}</p>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <SeverityBadge severity={log.severity} />
                <span>{formatLogDate(log.createdAt)}</span>
              </div>
            </DashboardCard>
          </Link>
        );
      })}
    </div>
  );
}
