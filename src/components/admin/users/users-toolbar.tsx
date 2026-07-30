"use client";

import { MoreFiltersSheet } from "@/components/common/more-filters-sheet";
import { DatePickerField } from "@/components/common/date-picker-field";
import { ResponsiveSearchControl } from "@/components/common/responsive-search-control";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  adminUserLabel,
  adminUserStatuses,
} from "@/features/admin-users/user.presentation";

export function UsersToolbar({
  search,
  status,
  joinedFrom,
  joinedTo,
  onSearchChange,
  onStatusChange,
  onJoinedFromChange,
  onJoinedToChange,
}: {
  search: string;
  status: string;
  joinedFrom: string;
  joinedTo: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onJoinedFromChange: (value: string) => void;
  onJoinedToChange: (value: string) => void;
}) {
  const activeCount = [status !== "all", Boolean(joinedFrom), Boolean(joinedTo)].filter(Boolean).length;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <ResponsiveSearchControl
        placeholder="Search name, email, username..."
        desktopClassName="sm:w-80"
        value={search}
        onChange={onSearchChange}
      />
      <MoreFiltersSheet activeCount={activeCount} title="User Filters" description="Narrow down users by status and joined date.">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={(value) => value && onStatusChange(value)}>
            <SelectTrigger className="h-11 w-full rounded-xl bg-secondary/70">
              <span className="truncate">
                {status === "all" ? "All Statuses" : adminUserLabel(status)}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {adminUserStatuses.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Joined From</Label>
          <DatePickerField value={joinedFrom} onChange={onJoinedFromChange} placeholder="Select start date" />
        </div>
        <div className="space-y-2">
          <Label>Joined To</Label>
          <DatePickerField value={joinedTo} onChange={onJoinedToChange} placeholder="Select end date" />
        </div>
      </MoreFiltersSheet>
    </div>
  );
}
