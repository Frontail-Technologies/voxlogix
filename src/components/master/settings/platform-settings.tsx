"use client";

import { AppIcon } from "@/components/common/app-icon";
import {
  DashboardCard,
  DashboardPageHeader,
} from "@/components/common/dashboard-ui";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function PlatformSettings() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Settings"
        description="Manage platform settings and configurations"
      />

      <Tabs
        defaultValue="general"
        orientation="vertical"
        className="grid gap-4 lg:grid-cols-[260px_1fr]"
      >
        <DashboardCard className="h-fit">
          <CardContent className="p-3">
            <TabsList className="flex max-h-32 w-full flex-col items-stretch justify-start gap-1 overflow-hidden rounded-xl bg-transparent p-0">
              <TabsTrigger
                value="general"
                className="h-11 justify-start rounded-xl px-3 data-active:bg-primary data-active:text-primary-foreground"
              >
                General
              </TabsTrigger>
              <TabsTrigger
                value="ai"
                className="h-11 justify-start rounded-xl px-3 data-active:bg-primary data-active:text-primary-foreground"
              >
                AI Settings
              </TabsTrigger>
            </TabsList>
          </CardContent>
        </DashboardCard>

        <DashboardCard>
          <GeneralSettings />
          <AISettings />
        </DashboardCard>
      </Tabs>
    </div>
  );
}

function GeneralSettings() {
  return (
    <TabsContent value="general" className="m-0">
      <CardContent className="space-y-6 p-6">
        <div>
          <h2 className="text-lg font-semibold">General Settings</h2>
          <p className="text-sm text-muted-foreground">
            Default platform identity and operating limits.
          </p>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="platform-name">Platform Name</Label>
            <Input
              id="platform-name"
              defaultValue="VoxLogiX"
              className="h-11 rounded-xl bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label>Platform Logo</Label>
            <div className="flex h-11 items-center justify-between rounded-xl border border-border bg-background px-3">
              <div className="flex items-center gap-2 font-semibold">
                <AppIcon name="voice" className="size-5 text-primary" />
                Vox<span className="text-primary">LogiX</span>
              </div>
              <Button variant="outline" size="sm" className="rounded-xl">
                Change
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Default Theme</Label>
            <Select defaultValue="Light">
              <SelectTrigger className="h-11 w-full rounded-xl bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Light">Light</SelectItem>
                <SelectItem value="Dark">Dark</SelectItem>
                <SelectItem value="System">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Default Language</Label>
            <Select defaultValue="English">
              <SelectTrigger className="h-11 w-full rounded-xl bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Hindi">Hindi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="trial-days">Default Trial Days</Label>
            <Input
              id="trial-days"
              defaultValue="15"
              className="h-11 rounded-xl bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="upload-size">Max Upload Size (MB)</Label>
            <Input
              id="upload-size"
              defaultValue="50"
              className="h-11 rounded-xl bg-background"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button className="rounded-xl">Save Changes</Button>
        </div>
      </CardContent>
    </TabsContent>
  );
}

function AISettings() {
  return (
    <TabsContent value="ai" className="m-0">
      <CardContent className="space-y-6 p-6">
        <div>
          <h2 className="text-lg font-semibold">AI Settings</h2>
          <p className="text-sm text-muted-foreground">
            Mock controls for API credentials and platform AI extraction
            defaults.
          </p>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <div className="space-y-2">
            <Label>AI Provider</Label>
            <Select defaultValue="OpenAI">
              <SelectTrigger className="h-11 w-full rounded-xl bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OpenAI">OpenAI</SelectItem>
                <SelectItem value="Azure OpenAI">Azure OpenAI</SelectItem>
                <SelectItem value="Custom Provider">Custom Provider</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="monthly-ai-limit">Default Monthly AI Limit</Label>
            <Input
              id="monthly-ai-limit"
              defaultValue="1,500 minutes"
              className="h-11 rounded-xl bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="api-key-name">API Key Name</Label>
            <Input
              id="api-key-name"
              defaultValue="Production OpenAI Key"
              className="h-11 rounded-xl bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <div className="flex gap-2">
              <Input
                id="api-key"
                type="password"
                defaultValue="sk-voxlogix-demo-key"
                className="h-11 rounded-xl bg-background"
              />
              <Button type="button" variant="outline" className="h-11 rounded-xl">
                Add Key
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="model-name">Default Model</Label>
            <Input
              id="model-name"
              defaultValue="gpt-4.1-mini"
              className="h-11 rounded-xl bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label>Key Status</Label>
            <Select defaultValue="Active">
              <SelectTrigger className="h-11 w-full rounded-xl bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Testing">Testing</SelectItem>
                <SelectItem value="Disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3">
            <div>
              <p className="text-sm font-medium">AI Structured Extraction</p>
              <p className="text-xs text-muted-foreground">
                Enabled by default for demo companies.
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3">
            <div>
              <p className="text-sm font-medium">Usage Cost Alerts</p>
              <p className="text-xs text-muted-foreground">
                Notify Master when usage crosses limits.
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>

        <div className="flex justify-end">
          <Button className="rounded-xl">Save Changes</Button>
        </div>
      </CardContent>
    </TabsContent>
  );
}
