import Link from "next/link";

import { AppIcon } from "@/components/common/app-icon";
import {
  DashboardCard,
  DashboardPageHeader,
  StatusBadge,
} from "@/components/common/dashboard-ui";
import { buttonVariants } from "@/components/ui/button";
import { globalModules } from "@/data/mock-master";
import { cn } from "@/lib/utils";

export function ModulesList() {
  return (
    <div className="space-y-6">
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {globalModules.map((module) => (
          <DashboardCard key={module.name} className="rounded-xl">
            <div className="space-y-5 p-4">
              <div className="flex items-start justify-between gap-3">
                <Link
                  href="/master/modules/equipment/edit"
                  className="flex min-w-0 items-center gap-3"
                >
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/14 text-primary">
                    <AppIcon name={module.icon} className="size-6" />
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
                  className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  <AppIcon name="more" className="size-5" />
                  <span className="sr-only">Module actions</span>
                </Link>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-muted-foreground">
                  {module.availability}
                </span>
                <StatusBadge status={module.status} />
              </div>
            </div>
          </DashboardCard>
        ))}
      </div>
    </div>
  );
}
