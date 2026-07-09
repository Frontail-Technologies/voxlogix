"use client";

import { ResponsiveSearchControl } from "@/components/common/responsive-search-control";
import { TablePagination } from "@/components/common/table-pagination";
import {
  DashboardCard,
  DashboardPageHeader,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/dashboard-ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { masterActivities } from "@/data/mock-master";
import { usePagination } from "@/hooks/use-pagination";

export function ActivitiesList() {
  const pagination = usePagination({ items: masterActivities });

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader
        title="Activities"
        description="Track platform actions across companies, admins, modules, and AI settings"
      />

      <div className="space-y-3">
        <ActivitiesToolbar />
        <DashboardCard>
          <ActivitiesTable activities={pagination.pageItems} />
        </DashboardCard>
        <TablePagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          startItem={pagination.startItem}
          endItem={pagination.endItem}
          totalItems={pagination.totalItems}
          canPrevious={pagination.canPrevious}
          canNext={pagination.canNext}
          onPageChange={pagination.goToPage}
          onPrevious={pagination.previousPage}
          onNext={pagination.nextPage}
        />
      </div>
    </div>
  );
}

function ActivitiesToolbar() {
  return (
    <div className="grid grid-cols-[2.25rem_minmax(0,1fr)_minmax(0,1fr)] items-center gap-2 lg:flex lg:items-center lg:justify-between">
      <ResponsiveSearchControl placeholder="Search activity..." />
      <div className="contents lg:flex lg:gap-3">
        <Select defaultValue="All Areas">
          <SelectTrigger className="h-10 w-full rounded-xl bg-secondary/70 lg:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Areas">All Areas</SelectItem>
            <SelectItem value="Companies">Companies</SelectItem>
            <SelectItem value="Admins">Admins</SelectItem>
            <SelectItem value="Modules">Modules</SelectItem>
            <SelectItem value="AI Usage">AI Usage</SelectItem>
            <SelectItem value="Settings">Settings</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="All Actions">
          <SelectTrigger className="h-10 w-full rounded-xl bg-secondary/70 lg:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Actions">All Actions</SelectItem>
            <SelectItem value="Created">Created</SelectItem>
            <SelectItem value="Updated">Updated</SelectItem>
            <SelectItem value="Suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function ActivitiesTable({
  activities,
}: {
  activities: typeof import("@/data/mock-master").masterActivities;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Event</TableHead>
          <TableHead>Area</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Action</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {activities.map((activity) => (
          <TableRow key={`${activity.event}-${activity.time}`}>
            <TableCell className="font-medium text-foreground">
              {activity.event}
            </TableCell>
            <TableCell>{activity.area}</TableCell>
            <TableCell>{activity.company}</TableCell>
            <TableCell>{activity.user}</TableCell>
            <TableCell>{activity.action}</TableCell>
            <TableCell>
              <StatusBadge status={activity.status} />
            </TableCell>
            <TableCell className="text-right text-muted-foreground">
              {activity.time}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
