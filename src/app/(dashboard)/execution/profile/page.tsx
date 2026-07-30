"use client";

import Link from "next/link";

import { AppIcon } from "@/components/common/app-icon";
import { DashboardCard, DashboardPageHeader } from "@/components/common/dashboard-ui";
import { SessionProfileCard } from "@/components/common/session-profile-card";
import { MasterDetailSkeleton } from "@/components/master/master-skeletons";
import { buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/features/auth/auth-provider";
import { cn } from "@/lib/utils";

export default function ExecutionProfilePage() {
  const { user, company, isLoading } = useAuth();

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader
        title="Profile"
        description="Your account details and session controls"
        action={
          <Link href="/execution/profile/change-password" className={cn(buttonVariants({ variant: "outline" }), "rounded-xl")}>
            <AppIcon name="settings" className="size-4" />
            Change Password
          </Link>
        }
      />
      {isLoading ? <MasterDetailSkeleton /> : null}
      {!isLoading && user ? <SessionProfileCard user={user} companyName={company?.name} /> : null}
      {!isLoading && !user ? (
        <DashboardCard>
          <p className="p-5 text-sm text-muted-foreground">No active session found.</p>
        </DashboardCard>
      ) : null}
    </div>
  );
}
