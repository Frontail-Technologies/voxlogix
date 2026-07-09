"use client";

import Link from "next/link";
import { useState } from "react";

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

type CompanyActionsMenuProps = {
  companyId: string;
  companyName: string;
};

export function CompanyActionsMenu({
  companyId,
  companyName,
}: CompanyActionsMenuProps) {
  const baseHref = `/master/companies/${companyId}`;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
          <AppIcon name="more" className="size-5" />
          <span className="sr-only">Open company actions</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52 rounded-xl">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Company Actions</DropdownMenuLabel>
            <DropdownMenuItem className="p-0">
              <Link
                href={baseHref}
                className="flex w-full items-center gap-2 px-2 py-1.5"
              >
                <AppIcon name="companies" className="size-4" />
                View Detail
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-0">
              <Link
                href={`${baseHref}/edit`}
                className="flex w-full items-center gap-2 px-2 py-1.5"
              >
                <AppIcon name="settings" className="size-4" />
                Edit Company
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-0">
              <Link
                href={`${baseHref}/access`}
                className="flex w-full items-center gap-2 px-2 py-1.5"
              >
                <AppIcon name="permissions" className="size-4" />
                Access Control
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-0">
              <Link
                href={`${baseHref}/usage`}
                className="flex w-full items-center gap-2 px-2 py-1.5"
              >
                <AppIcon name="ai" className="size-4" />
                Usage
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <AppIcon name="warning" className="size-4" />
              Delete Company
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete company?"
        description={`This will remove ${companyName} from the platform mock data. This action is only a UI placeholder for now.`}
        confirmLabel="Delete Company"
      />
    </>
  );
}
