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
import { EntityAvatar } from "@/components/common/entity-avatar";
import { TruncatedText } from "@/components/common/truncated-text";
import { prefetchAdminLogDetail } from "@/features/logs/api/log.queries";
import type { AdminLogListItem } from "@/features/logs/api/log.types";
import { prefetchEquipmentDetail } from "@/features/admin-equipment/api/equipment.queries";
import {
  formatLogDate,
  logLabel,
} from "@/features/logs/log.presentation";

import { LogActionsMenu } from "./log-actions-menu";
import { LogStatusBadge, SeverityBadge } from "./log-badges";

export function LogsTable({ logs }: { logs: AdminLogListItem[] }) {
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
          <TableHead>Created By</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.length ? (
          logs.map((log) => {
            const equipment = log.equipment;

            return (
            <TableRow key={log.id}>
              <TableCell className="max-w-64 whitespace-normal">
                <Link href={`/admin/logs/${log.id}`} onMouseEnter={() => void prefetchAdminLogDetail(queryClient, log.id)} onFocus={() => void prefetchAdminLogDetail(queryClient, log.id)}>
                  <TruncatedText text={log.title} className="w-56 font-medium text-foreground" />
                  <p className="text-xs text-muted-foreground">{log.logNumber}</p>
                </Link>
              </TableCell>
              <TableCell>
                {equipment?.name ? (
                  <Link
                    href={`/admin/equipment/${equipment.id}`}
                    className="block"
                    onMouseEnter={() => equipment.id ? void prefetchEquipmentDetail(queryClient, equipment.id) : undefined}
                    onFocus={() => equipment.id ? void prefetchEquipmentDetail(queryClient, equipment.id) : undefined}
                  >
                    <p className="text-foreground">{equipment.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {equipment.equipmentCode ?? "-"}
                    </p>
                  </Link>
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
              <TableCell>
                <div className="flex items-center gap-2">
                  <EntityAvatar
                    initials={log.createdBy.initials ?? "AD"}
                    className="size-8"
                    fallbackClassName="text-xs"
                  />
                  <span>{log.createdBy.fullName ?? "System"}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatLogDate(log.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <LogActionsMenu log={log} />
              </TableCell>
            </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell colSpan={9} className="py-8 text-center text-muted-foreground">
              No logs found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
