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
  useDeleteEquipment,
  useUpdateEquipment,
} from "@/features/admin-equipment/api/equipment.mutations";
import { showApiErrorToast } from "@/lib/api/error-toast";

const maintenanceStatus = "UNDER_MAINTENANCE";

type EquipmentActionsMenuProps = {
  equipmentId: string;
  equipmentName: string;
};

export function EquipmentActionsMenu({
  equipmentId,
  equipmentName,
}: EquipmentActionsMenuProps) {
  const router = useRouter();
  const baseHref = `/admin/equipment/${equipmentId}`;
  const updateMutation = useUpdateEquipment(equipmentId);
  const deleteMutation = useDeleteEquipment();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  async function markUnderMaintenance() {
    try {
      await updateMutation.mutateAsync({ status: maintenanceStatus });
      toast.success(`${equipmentName} marked under maintenance`);
    } catch (error) {
      showApiErrorToast(error, "Could not update equipment status");
    }
  }

  async function deleteCurrentEquipment() {
    try {
      await deleteMutation.mutateAsync(equipmentId);
      toast.success(`${equipmentName} deleted`);
      router.push("/admin/equipment");
    } catch (error) {
      showApiErrorToast(error, "Could not delete equipment");
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
          <AppIcon name="more" className="size-5" />
          <span className="sr-only">Open equipment actions</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 rounded-xl">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Equipment Actions</DropdownMenuLabel>
            <DropdownMenuItem className="p-0">
              <Link
                href={baseHref}
                className="flex w-full items-center gap-2 px-2 py-1.5"
              >
                <AppIcon name="equipment" className="size-4" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-0">
              <Link
                href={`${baseHref}/edit`}
                className="flex w-full items-center gap-2 px-2 py-1.5"
              >
                <AppIcon name="settings" className="size-4" />
                Edit Equipment
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-0">
              <Link
                href="/admin/logs"
                className="flex w-full items-center gap-2 px-2 py-1.5"
              >
                <AppIcon name="logs" className="size-4" />
                View Logs
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={updateMutation.isPending}
              onSelect={(event) => {
                event.preventDefault();
                void markUnderMaintenance();
              }}
            >
              <AppIcon name="activity" className="size-4" />
              Mark Under Maintenance
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              variant="destructive"
              disabled={deleteMutation.isPending}
              onSelect={(event) => {
                event.preventDefault();
                setDeleteDialogOpen(true);
              }}
            >
              <AppIcon name="trash" className="size-4" />
              Delete Equipment
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete equipment?"
        description={`This will permanently delete ${equipmentName}. Existing logs may keep historical references, but this equipment will no longer appear in equipment lists.`}
        confirmLabel="Delete Equipment"
        onConfirm={() => void deleteCurrentEquipment()}
      />
    </>
  );
}
