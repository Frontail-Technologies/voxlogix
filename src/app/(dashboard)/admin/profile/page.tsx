"use client";

import { DashboardCard, DashboardPageHeader } from "@/components/common/dashboard-ui";
import { SessionProfileCard } from "@/components/common/session-profile-card";
import { MasterDetailSkeleton } from "@/components/master/master-skeletons";
import { useAuth } from "@/features/auth/auth-provider";

export default function AdminProfilePage() {
  const { user, company, isLoading } = useAuth();

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader title="Admin Profile" description="Admin account details and session controls" />
      {isLoading ? <MasterDetailSkeleton /> : null}
      {!isLoading && user ? <SessionProfileCard user={user} companyName={company?.name} /> : null}
      {!isLoading && !user ? <DashboardCard><p className="p-5 text-sm text-muted-foreground">No active session found.</p></DashboardCard> : null}
    </div>
  );
}
