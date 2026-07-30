"use client";

import Link from "next/link";
import { useState } from "react";

import { AppIcon } from "@/components/common/app-icon";
import { CardContent, DashboardCard, DashboardPageHeader, StatusBadge } from "@/components/common/dashboard-ui";
import { EntityAvatar } from "@/components/common/entity-avatar";
import { MasterDetailSkeleton } from "@/components/master/master-skeletons";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAdminDetail } from "@/features/master-admins/api/admin.queries";
import type { AdminDetail } from "@/features/master-admins/api/admin.types";
import { cn } from "@/lib/utils";

import { AdminResetPasswordDialog } from "./admin-reset-password-dialog";

export function AdminDetailView({ adminId }: { adminId: string }) {
  const { data, isLoading, isError } = useAdminDetail(adminId);
  const admin = data?.data;

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader title="Admin Detail" description="Admin profile, assigned company, activity summary, and actions" hideDescriptionOnMobile />
      {isLoading ? <MasterDetailSkeleton /> : null}
      {isError ? <DashboardCard><p className="p-5 text-sm text-muted-foreground">Could not load admin detail.</p></DashboardCard> : null}
      {admin ? <div className="grid gap-3 sm:gap-4 xl:grid-cols-[1fr_320px]"><AdminProfileCard admin={admin} /><AdminQuickActions admin={admin} /></div> : null}
    </div>
  );
}

function AdminProfileCard({ admin }: { admin: AdminDetail }) {
  const summary = [
    { label: "Companies", value: admin.activitySummary.companies },
    { label: "Planners", value: admin.activitySummary.planners },
    { label: "Execution Users", value: admin.activitySummary.executionUsers },
    { label: "Logs Created", value: admin.activitySummary.logsCreated },
  ];
  return (
    <DashboardCard><CardContent className="space-y-3 p-3 sm:space-y-6 sm:p-6">
      <div className="flex items-center gap-3 sm:gap-4"><EntityAvatar initials={admin.initials} imageUrl={admin.avatarUrl ?? undefined} className="size-12 sm:size-16" fallbackClassName="text-base sm:text-lg" /><div><div className="flex items-center gap-2"><h2 className="text-xl font-semibold">{admin.fullName}</h2><StatusBadge status={label(admin.status)} /></div><p className="text-sm text-muted-foreground">{label(admin.role)}</p><p className="text-sm text-muted-foreground">{admin.company.name}</p></div></div>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4"><AdminInfoTile label="Email" value={admin.email} /><AdminInfoTile label="Phone" value={admin.phone} /><AdminInfoTile label="Last Login" value={formatDate(admin.lastLoginAt)} /><AdminInfoTile label="Joined On" value={formatDate(admin.joinedOn)} /></div>
      <div><h3 className="mb-3 font-semibold">Activity Summary</h3><div className="grid grid-cols-2 gap-3 xl:grid-cols-4">{summary.map((item) => <div key={item.label} className="rounded-2xl border border-border bg-background p-3 sm:p-4"><p className="text-xs text-muted-foreground">{item.label}</p><p className="mt-1 text-lg font-semibold sm:text-2xl">{item.value}</p></div>)}</div></div>
      <div className="rounded-2xl border border-border bg-background p-4"><h3 className="font-semibold">Recent Login History</h3><div className="mt-4 space-y-3">{admin.recentLoginHistory.length ? admin.recentLoginHistory.map((item) => <div key={item.id} className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm"><span className="text-foreground">{formatDate(item.loggedInAt)}</span><span className="text-muted-foreground">{item.channel}</span></div>) : <p className="text-sm text-muted-foreground">No login history found.</p>}</div></div>
    </CardContent></DashboardCard>
  );
}

function AdminQuickActions({ admin }: { admin: AdminDetail }) {
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const baseHref = `/master/admins/${admin.id}`;
  return (
    <>
      <div className="order-first grid grid-cols-3 gap-2 xl:hidden"><Link href={`${baseHref}/edit`} className={cn(buttonVariants({ variant: "outline" }), "h-14 flex-col gap-1 rounded-xl px-1 text-xs")}><AppIcon name="admins" className="size-4" />Edit</Link><Button variant="outline" className="h-14 flex-col gap-1 rounded-xl px-1 text-xs" onClick={() => setResetDialogOpen(true)}><AppIcon name="permissions" className="size-4" />Reset</Button><Button variant="outline" className="h-14 flex-col gap-1 rounded-xl px-1 text-xs text-destructive hover:text-destructive"><AppIcon name="warning" className="size-4" />Disable</Button></div>
      <DashboardCard className="hidden xl:block"><CardContent className="space-y-3 p-5"><h3 className="font-semibold">Actions</h3><Link href={`${baseHref}/edit`} className={cn(buttonVariants({ variant: "outline" }), "w-full justify-start rounded-xl")}><AppIcon name="admins" className="size-4" />Edit Admin</Link><Button variant="outline" className="w-full justify-start rounded-xl" onClick={() => setResetDialogOpen(true)}><AppIcon name="permissions" className="size-4" />Reset Password</Button><Button variant="destructive" className="w-full justify-start rounded-xl"><AppIcon name="warning" className="size-4" />Deactivate Admin</Button></CardContent></DashboardCard>
      <AdminResetPasswordDialog adminId={admin.id} adminName={admin.fullName} adminEmail={admin.email} open={resetDialogOpen} onOpenChange={setResetDialogOpen} />
    </>
  );
}

function AdminInfoTile({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl border border-border bg-background p-3 sm:p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-sm font-medium">{value}</p></div>; }
function label(value: string) { return value.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()); }
function formatDate(value: string | null) { return value ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value)) : "-"; }
