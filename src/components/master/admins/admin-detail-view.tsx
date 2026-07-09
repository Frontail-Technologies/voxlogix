import Link from "next/link";

import { AppIcon } from "@/components/common/app-icon";
import {
  CardContent,
  DashboardCard,
  DashboardPageHeader,
  StatusBadge,
} from "@/components/common/dashboard-ui";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { selectedAdmin } from "@/data/mock-master";
import { cn } from "@/lib/utils";

export function AdminDetailView() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Admin Detail"
        description="Admin profile, assigned company, activity summary, and actions"
        action={
          <Link
            href="/master/admins/john-doe/edit"
            className={buttonVariants({ className: "rounded-xl" })}
          >
            Edit Admin
          </Link>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <AdminProfileCard />
        <AdminQuickActions />
      </div>
    </div>
  );
}

function AdminProfileCard() {
  return (
    <DashboardCard>
      <CardContent className="space-y-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar className="size-16 rounded-2xl">
            <AvatarFallback className="rounded-2xl bg-accent text-lg font-semibold text-accent-foreground">
              {selectedAdmin.initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">{selectedAdmin.admin}</h2>
              <StatusBadge status={selectedAdmin.status} />
            </div>
            <p className="text-sm text-muted-foreground">{selectedAdmin.role}</p>
            <p className="text-sm text-muted-foreground">
              {selectedAdmin.company}
            </p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <AdminInfoTile label="Email" value={selectedAdmin.email} />
          <AdminInfoTile label="Phone" value={selectedAdmin.phone} />
          <AdminInfoTile label="Last Login" value={selectedAdmin.lastLogin} />
          <AdminInfoTile label="Joined On" value={selectedAdmin.joinedOn} />
        </div>

        <div>
          <h3 className="mb-3 font-semibold">Activity Summary</h3>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {selectedAdmin.summary.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-border bg-background p-4"
              >
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="mt-1 text-2xl font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-background p-4">
          <h3 className="font-semibold">Recent Login History</h3>
          <div className="mt-4 space-y-3">
            {["31 May 2025, 10:30 AM", "30 May 2025, 6:12 PM", "29 May 2025, 9:05 AM"].map(
              (item) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm"
                >
                  <span className="text-foreground">{item}</span>
                  <span className="text-muted-foreground">Web session</span>
                </div>
              ),
            )}
          </div>
        </div>
      </CardContent>
    </DashboardCard>
  );
}

function AdminQuickActions() {
  return (
    <DashboardCard>
      <CardContent className="space-y-3 p-5">
        <h3 className="font-semibold">Actions</h3>
        <Link
          href="/master/admins/john-doe/edit"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-full justify-start rounded-xl",
          )}
        >
          <AppIcon name="admins" className="size-4" />
          Edit Admin
        </Link>
        <Button variant="outline" className="w-full justify-start rounded-xl">
          <AppIcon name="permissions" className="size-4" />
          Reset Password
        </Button>
        <Button variant="destructive" className="w-full justify-start rounded-xl">
          <AppIcon name="warning" className="size-4" />
          Deactivate Admin
        </Button>
      </CardContent>
    </DashboardCard>
  );
}

function AdminInfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}
