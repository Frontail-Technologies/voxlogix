import { DashboardCard, DashboardPageHeader } from "@/components/common/dashboard-ui";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { companyAccessToggles, selectedCompany } from "@/data/mock-master";

export default function CompanyAccessPage() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Company Access Control"
        description={`Manage access and limits for ${selectedCompany.company}`}
      />

      <DashboardCard>
        <CardContent className="space-y-6 p-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {companyAccessToggles.map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-2xl border border-border bg-background p-4">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">Company-level permission</p>
                </div>
                <Switch defaultChecked={item.enabled} />
              </div>
            ))}
          </div>

          <div className="grid gap-4 border-t border-border pt-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="user-limit">User Creation Limit</Label>
              <Input id="user-limit" defaultValue="75" className="h-11 rounded-xl bg-background" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ai-limit">AI Usage Limit</Label>
              <Input id="ai-limit" defaultValue="1,500 minutes" className="h-11 rounded-xl bg-background" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storage-limit">Storage Limit</Label>
              <Input id="storage-limit" defaultValue="500 GB" className="h-11 rounded-xl bg-background" />
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
