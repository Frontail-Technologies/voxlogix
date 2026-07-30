"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { AppIcon } from "@/components/common/app-icon";
import {
  DashboardCard,
  DashboardPageHeader,
} from "@/components/common/dashboard-ui";
import { TablePagination } from "@/components/common/table-pagination";
import { MasterCardGridSkeleton, MasterTableSkeleton, MasterToolbarSkeleton } from "@/components/master/master-skeletons";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useAdminUsersList,
} from "@/features/admin-users/api/user.api";
import type { AdminListItem } from "@/features/master-admins/api/admin.types";
import { useAuth } from "@/features/auth/auth-provider";

import { UsersSummaryCards } from "./users-summary-cards";
import { UsersTable } from "./users-table";
import { UsersToolbar } from "./users-toolbar";

const UserFormSheet = dynamic(() => import("./user-form-sheet").then((mod) => mod.UserFormSheet), {
  ssr: false,
  loading: () => null,
});

type FormState = {
  open: boolean;
  mode: "create" | "edit" | "view";
  user?: AdminListItem;
};

const tabRoles = {
  planners: "PLANNER",
  execution: "EXECUTION",
} as const;

type UserTab = keyof typeof tabRoles;

export function UsersView() {
  const { company, isLoading: authLoading } = useAuth();

  if (authLoading) {
    return <UsersInitialSkeleton />;
  }

  if (!company?.id) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <DashboardPageHeader
          title="Users"
          description="Manage planners and execution users for your company."
        />
        <DashboardCard>
          <p className="p-5 text-sm text-muted-foreground">
            Could not find a company for this session.
          </p>
        </DashboardCard>
      </div>
    );
  }

  return <UsersDataView companyId={company.id} />;
}

function UsersDataView({ companyId }: { companyId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = normalizeTab(searchParams.get("tab"));
  const page = Number(searchParams.get("page") ?? "1");
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "all";
  const joinedFrom = searchParams.get("joinedFrom") ?? "";
  const joinedTo = searchParams.get("joinedTo") ?? "";
  const role = tabRoles[tab];
  const [form, setForm] = useState<FormState>({ open: false, mode: "create" });

  const usersQuery = useAdminUsersList({
    companyId,
    role,
    page,
    limit: 20,
    search,
    status: status === "all" ? undefined : status,
    joinedFrom: joinedFrom || undefined,
    joinedTo: joinedTo || undefined,
  });
  const plannerSummary = useAdminUsersList({ companyId, role: "PLANNER", limit: 1 });
  const executionSummary = useAdminUsersList({ companyId, role: "EXECUTION", limit: 1 });
  const activePlannerSummary = useAdminUsersList({ companyId, role: "PLANNER", status: "ACTIVE", limit: 1 });
  const activeExecutionSummary = useAdminUsersList({ companyId, role: "EXECUTION", status: "ACTIVE", limit: 1 });
  const users = usersQuery.data?.data ?? [];
  const meta = usersQuery.data?.meta;

  function updateQuery(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "all") params.delete(key);
    else params.set(key, value);

    if (key !== "page") params.set("page", "1");

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }

  function openCreate() {
    setForm({ open: true, mode: "create", user: undefined });
  }

  function openView(user: AdminListItem) {
    setForm({ open: true, mode: "view", user });
  }

  function openEdit(user: AdminListItem) {
    setForm({ open: true, mode: "edit", user });
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader
        title="Users"
        description="Manage planners and execution users for your company."
        action={
          <Button type="button" className="rounded-xl" onClick={openCreate}>
            <AppIcon name="plus" className="size-4" />
            Add User
          </Button>
        }
      />

      {plannerSummary.isLoading || executionSummary.isLoading ? (
        <MasterCardGridSkeleton />
      ) : (
        <UsersSummaryCards
          totalUsers={(plannerSummary.data?.meta?.totalItems ?? 0) + (executionSummary.data?.meta?.totalItems ?? 0)}
          activeUsers={(activePlannerSummary.data?.meta?.totalItems ?? 0) + (activeExecutionSummary.data?.meta?.totalItems ?? 0)}
          planners={plannerSummary.data?.meta?.totalItems ?? 0}
          executionUsers={executionSummary.data?.meta?.totalItems ?? 0}
        />
      )}

      <Tabs value={tab} onValueChange={(value) => updateQuery("tab", value)}>
        <TabsList>
          <TabsTrigger value="planners">Planners</TabsTrigger>
          <TabsTrigger value="execution">Execution Users</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-3 sm:mt-4">
          <div className="space-y-3">
            <UsersToolbar
              search={search}
              status={status}
              joinedFrom={joinedFrom}
              joinedTo={joinedTo}
              onSearchChange={(value) => updateQuery("search", value)}
              onStatusChange={(value) => updateQuery("status", value)}
              onJoinedFromChange={(value) => updateQuery("joinedFrom", value)}
              onJoinedToChange={(value) => updateQuery("joinedTo", value)}
            />
            {meta ? (
              <TablePagination
                page={meta.page}
                totalPages={meta.totalPages}
                startItem={meta.totalItems ? meta.offset + 1 : 0}
                endItem={Math.min(meta.offset + meta.limit, meta.totalItems)}
                totalItems={meta.totalItems}
                canPrevious={meta.hasPreviousPage}
                canNext={meta.hasNextPage}
                onPageChange={(nextPage) => updateQuery("page", String(nextPage))}
                onPrevious={() => updateQuery("page", String(Math.max(1, page - 1)))}
                onNext={() => updateQuery("page", String(page + 1))}
              />
            ) : null}
            <DashboardCard>
              {usersQuery.isLoading ? <MasterTableSkeleton columns={9} /> : null}
              {usersQuery.isError ? (
                <p className="p-5 text-sm text-muted-foreground">
                  Could not load users.
                </p>
              ) : null}
              {!usersQuery.isLoading && !usersQuery.isError ? (
                <UsersTable users={users} onView={openView} onEdit={openEdit} />
              ) : null}
            </DashboardCard>
          </div>
        </TabsContent>
      </Tabs>

      {form.open ? (
        <UserFormSheet
          open={form.open}
          onOpenChange={(open) => setForm((current) => ({ ...current, open }))}
          mode={form.mode}
          user={form.user}
          companyId={companyId}
        />
      ) : null}
    </div>
  );
}

function UsersInitialSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader
        title="Users"
        description="Manage planners and execution users for your company."
      />
      <MasterCardGridSkeleton />
      <Tabs value="planners">
        <TabsList>
          <TabsTrigger value="planners">Planners</TabsTrigger>
          <TabsTrigger value="execution">Execution Users</TabsTrigger>
        </TabsList>
        <TabsContent value="planners" className="mt-3 sm:mt-4">
          <div className="space-y-3">
            <MasterToolbarSkeleton filters={1} />
            <DashboardCard>
              <MasterTableSkeleton columns={9} />
            </DashboardCard>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function normalizeTab(value: string | null): UserTab {
  return value === "execution" ? "execution" : "planners";
}
