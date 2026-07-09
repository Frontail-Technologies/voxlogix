import {
  DashboardCard,
  DashboardPageHeader,
  DashboardStatCard,
  UsageProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/dashboard-ui";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { companyUsageStats, selectedCompany, usageByCompany } from "@/data/mock-master";

export default function CompanyUsagePage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Company Usage Detail"
        description={`AI, storage, and usage details for ${selectedCompany.company}`}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {companyUsageStats.map((stat) => (
          <DashboardStatCard key={stat.label} {...stat} />
        ))}
      </div>

      <DashboardCard>
        <CardHeader>
          <CardTitle>Monthly Usage Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Share</TableHead>
                <TableHead className="text-right">Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usageByCompany.slice(0, 4).map((usage) => (
                <TableRow key={usage.company}>
                  <TableCell className="font-medium">{usage.company}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="w-16 text-sm text-muted-foreground">{usage.minutes}</span>
                      <UsageProgress value={usage.percentage * 3} />
                    </div>
                  </TableCell>
                  <TableCell>{usage.percentage}%</TableCell>
                  <TableCell className="text-right">{usage.cost}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </DashboardCard>
    </div>
  );
}
