import Link from "next/link";

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

type AdminActionsMenuProps = {
  adminId: string;
};

export function AdminActionsMenu({ adminId }: AdminActionsMenuProps) {
  const baseHref = `/master/admins/${adminId}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
        <AppIcon name="more" className="size-5" />
        <span className="sr-only">Open admin actions</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 rounded-xl">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Admin Actions</DropdownMenuLabel>
          <DropdownMenuItem className="p-0">
            <Link
              href={baseHref}
              className="flex w-full items-center gap-2 px-2 py-1.5"
            >
              <AppIcon name="admins" className="size-4" />
              View Detail
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-0">
            <Link
              href={`${baseHref}/edit`}
              className="flex w-full items-center gap-2 px-2 py-1.5"
            >
              <AppIcon name="settings" className="size-4" />
              Edit Admin
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <AppIcon name="permissions" className="size-4" />
            Reset Password
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive">
            <AppIcon name="warning" className="size-4" />
            Deactivate Admin
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
