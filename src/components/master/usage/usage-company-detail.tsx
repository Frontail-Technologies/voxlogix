import Link from "next/link";

import { AppIcon } from "@/components/common/app-icon";
import {
  DashboardCard,
  DashboardPageHeader,
  DashboardStatCard,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  UsageProgress,
  UsageVisual,
} from "@/components/common/dashboard-ui";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import {
  aiChartPoints,
  selectedCompany,
  selectedUsageCompanyStats,
  usageDailyBreakdown,
} from "@/data/mock-master";
import { cn } from "@/lib/utils";

export function UsageCompanyDetail() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="AI Usage Company Detail"
        description="Company-specific voice minutes, AI logs, failures, and estimated cost"
        action={
          <Link
            href="/master/usage"
            className={cn(buttonVariants({ variant: "outline" }), "rounded-xl")}
          >
            Back to Usage
          </Link>
        }
      />

      <DashboardCard>
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="size-14 rounded-2xl">
              <AvatarFallback className="rounded-2xl bg-accent text-lg font-semibold text-accent-foreground">
                {selectedCompany.logo}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold text-card-foreground">
                {selectedCompany.company}
              </h2>
              <p className="text-sm text-muted-foreground">
                {selectedCompany.plan} plan · {selectedCompany.businessType}
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-background px-4 py-3 text-sm">
            <span className="text-muted-foreground">Monthly AI Limit:</span>{" "}
            <span className="font-medium text-foreground">1,500 minutes</span>
          </div>
        </div>
      </DashboardCard>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {selectedUsageCompanyStats.map((stat) => (
          <DashboardStatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <DashboardCard>
          <div className="border-b border-border p-5">
            <h2 className="font-semibold text-card-foreground">
              Monthly Usage Trend
            </h2>
            <p className="text-sm text-muted-foreground">
              Mock usage curve for the selected company
            </p>
          </div>
          <div className="p-5">
            <UsageVisual points={aiChartPoints.slice(0, 18)} />
          </div>
        </DashboardCard>

        <DashboardCard>
          <div className="border-b border-border p-5">
            <h2 className="font-semibold text-card-foreground">Limit Usage</h2>
            <p className="text-sm text-muted-foreground">
              Current month consumption
            </p>
          </div>
          <div className="space-y-5 p-5">
            <LimitRow label="Voice minute limit" value="22%" progress={22} />
            <LimitRow label="AI log limit" value="59%" progress={59} />
            <LimitRow label="Estimated cost limit" value="44%" progress={44} />
            <div className="rounded-2xl border border-border bg-background p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/12 text-primary">
                  <AppIcon name="ai" className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    AI extraction enabled
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Equipment Log trial module
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DashboardCard>
      </div>

      <div className="space-y-3">
        <DashboardCard>
          <div className="border-b border-border p-5">
            <h2 className="font-semibold text-card-foreground">
              Daily Usage Breakdown
            </h2>
            <p className="text-sm text-muted-foreground">
              Mock daily AI requests and cost for May 2025
            </p>
          </div>
          <DailyBreakdownTable />
        </DashboardCard>
        <p className="px-1 text-sm text-muted-foreground">
          Showing 7 daily usage checkpoints
        </p>
      </div>
    </div>
  );
}

function LimitRow({
  label,
  value,
  progress,
}: {
  label: string;
  value: string;
  progress: number;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-muted-foreground">{value}</span>
      </div>
      <UsageProgress value={progress} />
    </div>
  );
}

function DailyBreakdownTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Voice Minutes</TableHead>
          <TableHead>AI Logs</TableHead>
          <TableHead>Failed Requests</TableHead>
          <TableHead className="text-right">Est Cost</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {usageDailyBreakdown.map((day) => (
          <TableRow key={day.date}>
            <TableCell className="font-medium">{day.date}</TableCell>
            <TableCell>{day.minutes}</TableCell>
            <TableCell>{day.aiLogs}</TableCell>
            <TableCell>{day.failed}</TableCell>
            <TableCell className="text-right">{day.cost}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
