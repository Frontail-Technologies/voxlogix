import { DashboardCard, DashboardPageHeader } from "@/components/common/dashboard-ui";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { companyAccessToggles, selectedCompany } from "@/data/mock-master";

export default function CompanyAccessPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader
        title="Company Access Control"
        description={`Manage access and limits for ${selectedCompany.company}`}
      />

      <DashboardCard>
        <CardContent className="space-y-4 p-4 sm:space-y-6 sm:p-6">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
            {companyAccessToggles.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-secondary/70 p-3 sm:p-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="hidden text-xs text-muted-foreground sm:block">Company-level permission</p>
                </div>
                <Switch defaultChecked={item.enabled} />
              </div>
            ))}
          </div>

          <div className="grid gap-3 border-t border-border pt-4 sm:gap-4 sm:pt-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="user-limit">User Creation Limit</Label>
              <Input id="user-limit" defaultValue="75" className="h-11 rounded-xl bg-secondary/70" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ai-limit">AI Usage Limit</Label>
              <Input id="ai-limit" defaultValue="1,500 minutes" className="h-11 rounded-xl bg-secondary/70" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storage-limit">Storage Limit</Label>
              <Input id="storage-limit" defaultValue="500 GB" className="h-11 rounded-xl bg-secondary/70" />
            </div>
          </div>

          <div className="flex justify-end">
            <Button className="rounded-xl">Save Access Rules</Button>
          </div>
        </CardContent>
      </DashboardCard>
    </div>
  );
}
