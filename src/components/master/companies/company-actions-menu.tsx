"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { showApiErrorToast } from "@/lib/api/error-toast";

import { AppIcon } from "@/components/common/app-icon";
import { DeleteConfirmDialog } from "@/components/common/delete-confirm-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useDeleteCompany, useUpdateCompany } from "@/features/master-companies/api/company.mutations";

type CompanyActionsMenuProps = { companyId: string; companyName: string; companyStatus: string };

export function CompanyActionsMenu({ companyId, companyName, companyStatus }: CompanyActionsMenuProps) {
  const router = useRouter();
  const deleteMutation = useDeleteCompany();
  const updateMutation = useUpdateCompany(companyId);
  const baseHref = `/master/companies/${companyId}`;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const isSuspended = companyStatus === "SUSPENDED";

  async function handleDelete() {
    try {
      await deleteMutation.mutateAsync(companyId);
      toast.success("Company deleted");
      router.refresh();
    } catch (error) {
      showApiErrorToast(error, "Could not delete company");
    }
  }

  async function handleToggleSuspend() {
    try {
      await updateMutation.mutateAsync({ status: isSuspended ? "ACTIVE" : "SUSPENDED" });
      toast.success(isSuspended ? "Company reactivated" : "Company suspended");
      router.refresh();
    } catch (error) {
      showApiErrorToast(error, isSuspended ? "Could not reactivate company" : "Could not suspend company");
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"><AppIcon name="more" className="size-5" /><span className="sr-only">Open company actions</span></DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52 rounded-xl">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Company Actions</DropdownMenuLabel>
            <DropdownMenuItem className="p-0"><Link href={baseHref} className="flex w-full items-center gap-2 px-2 py-1.5"><AppIcon name="companies" className="size-4" />View Detail</Link></DropdownMenuItem>
            <DropdownMenuItem className="p-0"><Link href={`${baseHref}/edit`} className="flex w-full items-center gap-2 px-2 py-1.5"><AppIcon name="settings" className="size-4" />Edit Company</Link></DropdownMenuItem>
            <DropdownMenuItem className="p-0"><Link href={`${baseHref}/access`} className="flex w-full items-center gap-2 px-2 py-1.5"><AppIcon name="permissions" className="size-4" />Access Control</Link></DropdownMenuItem>
            <DropdownMenuItem className="p-0"><Link href={`${baseHref}/usage`} className="flex w-full items-center gap-2 px-2 py-1.5"><AppIcon name="ai" className="size-4" />Usage</Link></DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setSuspendDialogOpen(true)}><AppIcon name="warning" className="size-4" />{isSuspended ? "Reactivate Company" : "Suspend Company"}</DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={() => setDeleteDialogOpen(true)}><AppIcon name="warning" className="size-4" />Delete Company</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteConfirmDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} title="Delete company?" description={`This will remove ${companyName} from the platform.`} confirmLabel={deleteMutation.isPending ? "Deleting..." : "Delete Company"} onConfirm={handleDelete} />
      <DeleteConfirmDialog
        open={suspendDialogOpen}
        onOpenChange={setSuspendDialogOpen}
        title={isSuspended ? "Reactivate company?" : "Suspend company?"}
        description={isSuspended ? `${companyName} will regain access to the platform immediately.` : `${companyName} and its users will lose access to the platform immediately.`}
        confirmLabel={updateMutation.isPending ? "Saving..." : isSuspended ? "Reactivate" : "Suspend"}
        onConfirm={handleToggleSuspend}
      />
    </>
  );
}
