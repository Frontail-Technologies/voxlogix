"use client";

import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";

import { AppIcon } from "@/components/common/app-icon";
import { DashboardCard } from "@/components/common/dashboard-ui";
import { EntityAvatar } from "@/components/common/entity-avatar";
import { prefetchAdminLogDetail } from "@/features/logs/api/log.queries";
import type { AdminLogListItem } from "@/features/logs/api/log.types";
import { formatLogDate, logLabel } from "@/features/logs/log.presentation";

import { LogActionsMenu } from "./log-actions-menu";
import { LogStatusBadge, SeverityBadge } from "./log-badges";

export function LogsCards({ logs }: { logs: AdminLogListItem[] }) {
  const queryClient = useQueryClient();

  if (!logs.length) {
    return (
      <DashboardCard>
        <p className="p-5 text-sm text-muted-foreground">No logs found.</p>
      </DashboardCard>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      {logs.map((log) => (
        <DashboardCard key={log.id} className="overflow-hidden rounded-xl">
          <Link
            href={`/admin/logs/${log.id}`}
            className="block"
            onMouseEnter={() => void prefetchAdminLogDetail(queryClient, log.id)}
            onFocus={() => void prefetchAdminLogDetail(queryClient, log.id)}
          >
            <div className="flex aspect-16/9 items-center justify-center bg-secondary/50">
              {log.thumbnailUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={log.thumbnailUrl} alt={log.title} className="size-full object-cover" />
              ) : (
                <AppIcon name="image" className="size-8 text-muted-foreground" />
              )}
            </div>
          </Link>

          <div className="space-y-3 p-3 sm:p-4">
            <div className="flex items-start justify-between gap-2">
              <Link href={`/admin/logs/${log.id}`} className="min-w-0">
                <p className="truncate text-sm font-semibold text-card-foreground">{log.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{log.logNumber}</p>
              </Link>
              <LogActionsMenu log={log} />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <LogStatusBadge status={log.status} />
              <SeverityBadge severity={log.severity} />
            </div>

            <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
              <div className="flex min-w-0 items-center gap-1.5">
                <EntityAvatar initials={log.createdBy.initials ?? "AD"} className="size-6" fallbackClassName="text-[10px]" />
                <span className="truncate">{log.createdBy.fullName ?? "System"}</span>
              </div>
              <span className="shrink-0">{formatLogDate(log.createdAt)}</span>
            </div>

            <p className="text-xs text-muted-foreground">{logLabel(log.moduleType)}</p>
          </div>
        </DashboardCard>
      ))}
    </div>
  );
}
