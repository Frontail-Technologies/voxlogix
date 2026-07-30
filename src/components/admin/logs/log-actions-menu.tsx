"use client";

import Link from "next/link";
import { toast } from "sonner";

import { AppIcon } from "@/components/common/app-icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUpdateLogStatus } from "@/features/logs/api/log.mutations";
import type { AdminLogListItem } from "@/features/logs/api/log.types";
import { logLabel } from "@/features/logs/log.presentation";
import { showApiErrorToast } from "@/lib/api/error-toast";

const quickStatuses = [
  "PLANNED",
  "IN_PROGRESS",
  "COMPLETED",
  "NEEDS_CORRECTION",
] as const;

export function LogActionsMenu({ log }: { log: AdminLogListItem }) {
  const baseHref = `/admin/logs/${log.id}`;
  const statusMutation = useUpdateLogStatus(log.id);

  async function updateStatus(status: string) {
    try {
      await statusMutation.mutateAsync({ status });
      toast.success(`${log.logNumber} marked ${logLabel(status)}`);
    } catch (error) {
      showApiErrorToast(error, "Could not update log status");
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
        <AppIcon name="more" className="size-5" />
        <span className="sr-only">Open log actions</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-xl">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Log Actions</DropdownMenuLabel>
          <DropdownMenuItem className="p-0">
            <Link href={baseHref} className="flex w-full items-center gap-2 px-2 py-1.5">
              <AppIcon name="eye" className="size-4" />
              View Details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-0">
            <Link
              href={`${baseHref}/edit`}
              className="flex w-full items-center gap-2 px-2 py-1.5"
            >
              <AppIcon name="settings" className="size-4" />
              Edit Log
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Update Status</DropdownMenuLabel>
          {quickStatuses.map((status) => (
            <DropdownMenuItem
              key={status}
              disabled={statusMutation.isPending}
              onSelect={(event) => {
                event.preventDefault();
                void updateStatus(status);
              }}
            >
              <AppIcon name="status" className="size-4" />
              {logLabel(status)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
