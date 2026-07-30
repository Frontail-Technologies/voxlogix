"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { AppIcon } from "@/components/common/app-icon";
import { DeleteConfirmDialog } from "@/components/common/delete-confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useDeleteModule,
  useUpdateModule,
} from "@/features/master-modules/api/module.mutations";
import type { ModuleListItem } from "@/features/master-modules/api/module.types";
import { showApiErrorToast } from "@/lib/api/error-toast";

type ModuleActionsMenuProps = {
  module: ModuleListItem;
};

export function ModuleActionsMenu({ module }: ModuleActionsMenuProps) {
  const router = useRouter();
  const deleteMutation = useDeleteModule();
  const updateMutation = useUpdateModule(module.id);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const isActive = module.status === "ACTIVE";

  async function handleDelete() {
    try {
      await deleteMutation.mutateAsync(module.id);
      toast.success("Module deleted");
      router.refresh();
    } catch (error) {
      showApiErrorToast(error, "Could not delete module");
    }
  }

  async function handleToggleStatus() {
    try {
      await updateMutation.mutateAsync({
        name: module.name,
        moduleTypeId: module.moduleTypeId,
        category: module.category,
        status: isActive ? "INACTIVE" : "ACTIVE",
        availabilityText: module.availabilityText,
        icon: module.icon,
        color: module.color,
        description: module.description ?? undefined,
        mediaUrl: module.mediaUrl,
        mediaKey: module.mediaKey,
        voiceEnabled: module.voiceEnabled,
        feedEnabled: module.feedEnabled,
        feedOnlyOnAlert: module.feedOnlyOnAlert,
        requiresVoicePlayback: module.requiresVoicePlayback,
        maxAttachments: module.maxAttachments,
      });
      toast.success(isActive ? "Module deactivated" : "Module activated");
      router.refresh();
    } catch (error) {
      showApiErrorToast(error, isActive ? "Could not deactivate module" : "Could not activate module");
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
          <AppIcon name="more" className="size-5" />
          <span className="sr-only">Open module actions</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 rounded-xl">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Module Actions</DropdownMenuLabel>
            <DropdownMenuItem className="p-0">
              <Link href={`/master/modules/${module.id}`} className="flex w-full items-center gap-2 px-2 py-1.5">
                <AppIcon name="modules" className="size-4" />
                View Detail
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-0">
              <Link href={`/master/modules/${module.id}/edit`} className="flex w-full items-center gap-2 px-2 py-1.5">
                <AppIcon name="settings" className="size-4" />
                Edit Schema
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setStatusDialogOpen(true)}>
              <AppIcon name={isActive ? "stop" : "status"} className="size-4" />
              {isActive ? "Deactivate" : "Activate"}
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
              <AppIcon name="trash" className="size-4" />
              Delete Module
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteConfirmDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        title={isActive ? "Deactivate module?" : "Activate module?"}
        description={`${module.name} will be marked ${isActive ? "inactive" : "active"}.`}
        confirmLabel={updateMutation.isPending ? "Saving..." : isActive ? "Deactivate" : "Activate"}
        onConfirm={handleToggleStatus}
      />
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete module?"
        description={`This will remove ${module.name} and its schema fields.`}
        confirmLabel={deleteMutation.isPending ? "Deleting..." : "Delete Module"}
        onConfirm={handleDelete}
      />
    </>
  );
}
