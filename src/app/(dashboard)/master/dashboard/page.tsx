import {
  ActivityItem,
  CardContent,
  CardHeader,
  CardTitle,
  DashboardPageHeader,
  DashboardStatCard,
  DashboardCard,
  UsageVisual,
} from "@/components/common/dashboard-ui";
import { Button } from "@/components/ui/button";
import { aiChartPoints, masterStats, recentPlatformActivity } from "@/data/mock-master";

export default function MasterDashboardPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader
        title="Master Dashboard"
        description="Overview of platform activity and usage"
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {masterStats.slice(0, 8).map((stat) => (
          <DashboardStatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid gap-3 sm:gap-4 xl:grid-cols-[1.18fr_0.82fr]">
        <DashboardCard>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>AI Usage Overview</CardTitle>
              <p className="text-sm text-muted-foreground">This Month</p>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl">
              This Month
            </Button>
          </CardHeader>
          <CardContent>
            <UsageVisual points={aiChartPoints} />
          </CardContent>
        </DashboardCard>

        <DashboardCard>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Platform Activity</CardTitle>
            <Button variant="outline" size="sm" className="rounded-xl">
              View all
            </Button>
          </CardHeader>
          <CardContent className="space-y-5">
            {recentPlatformActivity.map((item) => (
              <ActivityItem key={`${item.title}-${item.time}`} {...item} />
            ))}
          </CardContent>
        </DashboardCard>
      </div>
    </div>
  );
}

