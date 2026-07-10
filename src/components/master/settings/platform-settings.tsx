"use client";

import { useState } from "react";

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

export function PlatformSettings() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader
        title="Settings"
        description="Manage AI provider settings and extraction defaults"
      />

      <DashboardCard>
        <AISettings />
      </DashboardCard>
    </div>
  );
}

function AISettings() {
  const [showApiKey, setShowApiKey] = useState(false);

  return (
    <CardContent className="space-y-4 p-4 sm:space-y-6 sm:p-6">
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="space-y-2">
          <Label>AI Provider</Label>
          <Select defaultValue="OpenAI">
            <SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70">
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
          <Label>Default Model</Label>
          <Select defaultValue="gpt-4.1-mini">
            <SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4.1-mini">GPT-4.1 Mini</SelectItem>
              <SelectItem value="gpt-4.1">GPT-4.1</SelectItem>
              <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
              <SelectItem value="custom-model">Custom Model</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="api-key-name">API Key Name</Label>
          <Input
            id="api-key-name"
            defaultValue="Production OpenAI Key"
            className="h-11 rounded-xl bg-secondary/70"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="api-key">API Key</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="api-key"
                type={showApiKey ? "text" : "password"}
                defaultValue="sk-voxlogix-demo-key"
                className="h-11 rounded-xl bg-secondary/70 pr-11"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute right-2 top-1/2 size-7 -translate-y-1/2 rounded-md border-0 bg-transparent p-0 text-muted-foreground shadow-none hover:bg-transparent hover:text-foreground focus-visible:ring-0"
                onClick={() => setShowApiKey((value) => !value)}
              >
                <AppIcon
                  name={showApiKey ? "eye-off" : "eye"}
                  className="size-4"
                />
                <span className="sr-only">
                  {showApiKey ? "Hide API key" : "Show API key"}
                </span>
              </Button>
            </div>
            <Button type="button" variant="outline" className="h-11 rounded-xl">
              Add Key
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Key Status</Label>
          <Select defaultValue="Active">
            <SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Testing">Testing</SelectItem>
              <SelectItem value="Disabled">Disabled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-secondary/70 px-4 py-2">
          <div>
            <p className="text-sm font-medium">AI Structured Extraction</p>
            <p className="text-xs text-muted-foreground">
              Enabled by default for demo companies.
            </p>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between rounded-xl bg-secondary/70 px-4 py-2">
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
  );
}
