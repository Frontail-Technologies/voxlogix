"use client";

import { CardContent, DashboardCard } from "@/components/common/dashboard-ui";
import { EntityAvatar } from "@/components/common/entity-avatar";
import { LogoutButton } from "@/components/common/logout-button";
import type { SessionUser } from "@/features/auth/api/auth.types";

export function SessionProfileCard({
  user,
  companyName,
}: {
  user: SessionUser;
  companyName?: string | null;
}) {
  const displayCompany = companyName ?? user.company?.name ?? "Platform";

  return (
    <DashboardCard>
      <CardContent className="space-y-6 p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <EntityAvatar initials={user.initials} className="size-16" fallbackClassName="text-lg" />
            <div>
              <h2 className="text-xl font-semibold text-card-foreground">{user.fullName}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-sm text-muted-foreground">
                {label(user.role)} · {displayCompany}
              </p>
            </div>
          </div>
          <LogoutButton />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <InfoTile label="Username" value={user.username} />
          <InfoTile label="Role" value={label(user.role)} />
          <InfoTile label="Company" value={displayCompany} />
          <InfoTile label="Password Reset" value={user.requirePasswordReset ? "Required" : "Not required"} />
        </div>
      </CardContent>
    </DashboardCard>
  );
}

function InfoTile({ label: tileLabel, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <p className="text-xs text-muted-foreground">{tileLabel}</p>
      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function label(value: string) {
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
