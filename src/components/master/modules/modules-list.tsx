"use client";

import Link from "next/link";
import { useState } from "react";

import { AppIcon } from "@/components/common/app-icon";
import {
  DashboardCard,
  DashboardPageHeader,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/dashboard-ui";
import { buttonVariants } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { globalModules } from "@/data/mock-master";
import { cn } from "@/lib/utils";

export function ModulesList() {
  const [tableView, setTableView] = useState(false);

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader
        title="Modules"
        description="Manage global platform modules and field schemas"
        action={
          <Link
            href="/master/modules/new"
            className={cn(buttonVariants(), "rounded-xl")}
          >
            <AppIcon name="plus" className="size-4" />
            New Module
          </Link>
        }
      />

      <div className="flex items-center justify-end gap-3">
        <span className="text-sm font-medium text-muted-foreground">Cards</span>
        <Switch checked={tableView} onCheckedChange={setTableView} />
        <span className="text-sm font-medium text-foreground">Table</span>
      </div>

      {tableView ? <ModulesTable /> : <ModulesCards />}
    </div>
  );
}

function ModulesCards() {
  return (
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
        {globalModules.map((module) => (
          <DashboardCard key={module.name} className="rounded-xl">
            <div className="space-y-3 p-3 sm:space-y-5 sm:p-4">
              <div className="flex items-start justify-between gap-3">
                <Link
                  href="/master/modules/equipment/edit"
                  className="flex min-w-0 items-center gap-2 sm:gap-3"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/14 text-primary sm:size-12 sm:rounded-2xl">
                    <AppIcon name={module.icon} className="size-5 sm:size-6" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-semibold text-card-foreground">
                      {module.name}
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {module.category}
                    </p>
                  </div>
                </Link>
                <Link
                  href="/master/modules/equipment/edit"
                  className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground sm:size-8"
                >
                  <AppIcon name="more" className="size-5" />
                  <span className="sr-only">Module actions</span>
                </Link>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="truncate text-xs font-medium text-muted-foreground">
                  {module.availability} · {module.createdOn}
                </span>
                <StatusBadge status={module.status} />
              </div>
            </div>
          </DashboardCard>
        ))}
      </div>
  );
}

function ModulesTable() {
  return (
    <DashboardCard>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Module</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Availability</TableHead>
            <TableHead>Fields</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {globalModules.map((module) => (
            <TableRow key={module.name}>
              <TableCell>
                <Link
                  href="/master/modules/equipment/edit"
                  className="flex items-center gap-3"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/14 text-primary">
                    <AppIcon name={module.icon} className="size-5" />
                  </div>
                  <span className="font-medium text-foreground">
                    {module.name}
                  </span>
                </Link>
              </TableCell>
              <TableCell>{module.category}</TableCell>
              <TableCell>{module.availability}</TableCell>
              <TableCell>{module.fields}</TableCell>
              <TableCell>{module.createdOn}</TableCell>
              <TableCell>
                <StatusBadge status={module.status} />
              </TableCell>
              <TableCell className="text-right">
                <Link
                  href="/master/modules/equipment/edit"
                  className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  <AppIcon name="more" className="size-5" />
                  <span className="sr-only">Module actions</span>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DashboardCard>
  );
}
