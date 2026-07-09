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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { aiChartPoints, aiUsageStats, usageByCompany } from "@/data/mock-master";
import { cn } from "@/lib/utils";

export function UsageDashboard() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="AI Usage Dashboard"
        description="Monitor AI usage, cost, and success rate across companies"
        action={
          <Link
            href="/master/settings"
            className={cn(buttonVariants({ variant: "outline" }), "rounded-xl")}
          >
            <AppIcon name="settings" className="size-4" />
            AI Settings
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {aiUsageStats.map((stat) => (
          <DashboardStatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
        <DashboardCard>
          <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-card-foreground">
                Date-wise Usage
              </h2>
              <p className="text-sm text-muted-foreground">
                Mock voice minutes and AI processing trend
              </p>
            </div>
            <PeriodSelect />
          </div>
          <div className="p-5">
            <UsageVisual points={aiChartPoints} />
          </div>
        </DashboardCard>

        <DashboardCard>
          <div className="border-b border-border p-5">
            <h2 className="font-semibold text-card-foreground">Usage Summary</h2>
            <p className="text-sm text-muted-foreground">
              Current month platform usage mix
            </p>
          </div>
          <div className="space-y-4 p-5">
            {usageByCompany.slice(0, 4).map((usage) => (
              <div key={usage.company} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">
                    {usage.company}
                  </span>
                  <span className="text-muted-foreground">
                    {usage.percentage}%
                  </span>
                </div>
                <UsageProgress value={usage.percentage * 3.2} />
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>

      <UsageByCompanySection />
    </div>
  );
}

function UsageByCompanySection() {
  return (
    <div className="space-y-3">
      <DashboardCard>
        <div className="flex flex-col gap-3 p-5 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-card-foreground">
              Usage by Company
            </h2>
            <p className="text-sm text-muted-foreground">
              Company-wise voice minutes, AI logs, success rate, and cost
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <PeriodSelect />
            <Select defaultValue="All Companies">
              <SelectTrigger className="h-10 w-full rounded-xl bg-background sm:w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Companies">All Companies</SelectItem>
                {usageByCompany.map((usage) => (
                  <SelectItem key={usage.company} value={usage.company}>
                    {usage.company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <UsageByCompanyTable />
      </DashboardCard>
      <p className="px-1 text-sm text-muted-foreground">
        Showing 1 to 5 of 24 companies
      </p>
    </div>
  );
}

function UsageByCompanyTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Company</TableHead>
          <TableHead>Voice Minutes</TableHead>
          <TableHead>AI Logs</TableHead>
          <TableHead>Success Rate</TableHead>
          <TableHead>Share</TableHead>
          <TableHead className="text-right">Est Cost</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {usageByCompany.map((usage) => {
          const companyId = toId(usage.company);

          return (
            <TableRow key={usage.company}>
              <TableCell>
                <Link
                  href={`/master/usage/${companyId}`}
                  className="flex items-center gap-3"
                >
                  <Avatar className="size-9 rounded-xl">
                    <AvatarFallback className="rounded-xl bg-accent text-xs font-semibold text-accent-foreground">
                      {usage.logo}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-foreground">
                    {usage.company}
                  </span>
                </Link>
              </TableCell>
              <TableCell>{usage.minutes}</TableCell>
              <TableCell>{usage.aiLogs}</TableCell>
              <TableCell>{usage.successRate}</TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <UsageProgress value={usage.percentage * 3.2} />
                  <span className="w-12 text-sm text-muted-foreground">
                    {usage.percentage}%
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">{usage.cost}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

function PeriodSelect() {
  return (
    <Select defaultValue="This Month">
      <SelectTrigger className="h-10 w-full rounded-xl bg-background sm:w-36">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="This Month">This Month</SelectItem>
        <SelectItem value="Last Month">Last Month</SelectItem>
        <SelectItem value="This Quarter">This Quarter</SelectItem>
      </SelectContent>
    </Select>
  );
}

function toId(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
