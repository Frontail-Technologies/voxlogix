"use client";

import { MoreFiltersSheet } from "@/components/common/more-filters-sheet";
import { ResponsiveSearchControl } from "@/components/common/responsive-search-control";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  logLabel,
  logModules,
  logSeverities,
  logStatuses,
} from "@/features/logs/log.presentation";

export function LogsToolbar({
  search,
  status,
  moduleType,
  severity,
  onSearchChange,
  onStatusChange,
  onModuleTypeChange,
  onSeverityChange,
  tableView,
  onTableViewChange,
}: {
  search: string;
  status: string;
  moduleType: string;
  severity: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onModuleTypeChange: (value: string) => void;
  onSeverityChange: (value: string) => void;
  tableView?: boolean;
  onTableViewChange?: (value: boolean) => void;
}) {
  const activeCount = [status !== "all", moduleType !== "all", severity !== "all"].filter(Boolean).length;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <ResponsiveSearchControl
        placeholder="Search logs, equipment, issue..."
        desktopClassName="sm:w-80"
        value={search}
        onChange={onSearchChange}
      />
      <MoreFiltersSheet activeCount={activeCount} title="Log Filters" description="Narrow down logs by status, module, and severity.">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={(value) => value && onStatusChange(value)}>
            <SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70">
              <span className="truncate">
                {status === "all" ? "All Statuses" : logLabel(status)}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {logStatuses.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Module</Label>
          <Select
            value={moduleType}
            onValueChange={(value) => value && onModuleTypeChange(value)}
          >
            <SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70">
              <span className="truncate">
                {moduleType === "all" ? "All Modules" : logLabel(moduleType)}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modules</SelectItem>
              {logModules.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Severity</Label>
          <Select
            value={severity}
            onValueChange={(value) => value && onSeverityChange(value)}
          >
            <SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70">
              <span className="truncate">
                {severity === "all" ? "All Severity" : logLabel(severity)}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severity</SelectItem>
              {logSeverities.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </MoreFiltersSheet>
      {onTableViewChange ? (
        <div className="ml-auto flex items-center justify-end gap-3">
          <span className="text-sm font-medium text-muted-foreground">Cards</span>
          <Switch checked={tableView} onCheckedChange={onTableViewChange} />
          <span className="text-sm font-medium text-foreground">Table</span>
        </div>
      ) : null}
    </div>
  );
}
