"use client";

import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/dashboard-ui";
import { TruncatedText } from "@/components/common/truncated-text";
import { prefetchAdminLogDetail } from "@/features/logs/api/log.queries";
import type { AdminLogListItem } from "@/features/logs/api/log.types";
import { formatLogDate, logLabel } from "@/features/logs/log.presentation";

import { LogStatusBadge, SeverityBadge } from "../../admin/logs/log-badges";

export function MyLogsTable({ logs }: { logs: AdminLogListItem[] }) {
  const queryClient = useQueryClient();

  return (
    <Table className="[&_td]:py-3">
      <TableHeader>
        <TableRow>
          <TableHead>Log</TableHead>
          <TableHead>Equipment</TableHead>
          <TableHead>Module</TableHead>
          <TableHead>Issue Category</TableHead>
          <TableHead>Severity</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.length ? (
          logs.map((log) => {
            const equipment = log.equipment;

            return (
            <TableRow key={log.id}>
              <TableCell className="max-w-64 whitespace-normal">
                <Link
                  href={`/execution/my-logs/${log.id}`}
                  onMouseEnter={() => void prefetchAdminLogDetail(queryClient, log.id)}
                  onFocus={() => void prefetchAdminLogDetail(queryClient, log.id)}
                >
                  <TruncatedText text={log.title} className="w-56 font-medium text-foreground" />
                  <p className="text-xs text-muted-foreground">{log.logNumber}</p>
                </Link>
              </TableCell>
              <TableCell>
                {equipment?.name ? (
                  <div>
                    <p className="text-foreground">{equipment.name}</p>
                    <p className="text-xs text-muted-foreground">{equipment.equipmentCode ?? "-"}</p>
                  </div>
                ) : (
                  <span className="text-muted-foreground">General activity</span>
                )}
              </TableCell>
              <TableCell>{logLabel(log.moduleType)}</TableCell>
              <TableCell>{log.issueCategory || "-"}</TableCell>
              <TableCell>
                <SeverityBadge severity={log.severity} />
              </TableCell>
              <TableCell>
                <LogStatusBadge status={log.status} />
              </TableCell>
              <TableCell className="text-muted-foreground">{formatLogDate(log.createdAt)}</TableCell>
            </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
              No logs found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
