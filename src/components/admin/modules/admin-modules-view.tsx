"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { AppIcon, type AppIconName } from "@/components/common/app-icon";
import {
  CardContent,
  CardHeader,
  CardTitle,
  DashboardCard,
  DashboardPageHeader,
  DashboardStatCard,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/dashboard-ui";
import { useRegisterBreadcrumbLabel } from "@/components/common/page-header-navigation";
import { ResponsiveSearchControl } from "@/components/common/responsive-search-control";
import { TablePagination } from "@/components/common/table-pagination";
import { MasterCardGridSkeleton, MasterTableSkeleton, ModuleCardGridSkeleton } from "@/components/master/master-skeletons";
import { buttonVariants } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { prefetchModuleDetail, useModuleDetail, useModulesList } from "@/features/master-modules/api/module.queries";
import type { ModuleDetail, ModuleField, ModuleListItem } from "@/features/master-modules/api/module.types";
import { useActiveModuleTypesOptions } from "@/features/master-module-types/api/module-type.queries";
import { cn } from "@/lib/utils";

const moduleStatuses = ["ACTIVE", "INACTIVE", "COMING_SOON"];

export function AdminModulesView() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "all";
  const type = searchParams.get("type") ?? "all";
  const moduleTypesQuery = useActiveModuleTypesOptions();
  const moduleTypeOptions = moduleTypesQuery.data?.data ?? [];
  const { data, isLoading, isError } = useModulesList({
    page,
    limit: 12,
    search,
    status: status === "all" ? undefined : status,
    moduleTypeId: type === "all" ? undefined : type,
  });
  const modules = data?.data ?? [];
  const meta = data?.meta;

  function updateQuery(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "all") params.delete(key);
    else params.set(key, value);
    if (key !== "page") params.set("page", "1");

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader
        title="Company Modules"
        description="Review enabled operational modules, capture schema, status, and AI extraction fields. Master controls module creation and global schema changes."
      />

      <ModulesToolbar
        search={search}
        status={status}
        type={type}
        typeOptions={moduleTypeOptions}
        onSearchChange={(value) => updateQuery("search", value)}
        onStatusChange={(value) => updateQuery("status", value)}
        onTypeChange={(value) => updateQuery("type", value)}
      />

      {meta ? (
        <TablePagination
          page={meta.page}
          totalPages={meta.totalPages}
          startItem={meta.totalItems ? meta.offset + 1 : 0}
          endItem={Math.min(meta.offset + meta.limit, meta.totalItems)}
          totalItems={meta.totalItems}
          canPrevious={meta.hasPreviousPage}
          canNext={meta.hasNextPage}
          onPageChange={(nextPage) => updateQuery("page", String(nextPage))}
          onPrevious={() => updateQuery("page", String(Math.max(1, page - 1)))}
          onNext={() => updateQuery("page", String(page + 1))}
        />
      ) : null}

      {isLoading ? <ModuleCardGridSkeleton /> : null}
      {isError ? (
        <DashboardCard>
          <p className="p-5 text-sm text-muted-foreground">Could not load modules.</p>
        </DashboardCard>
      ) : null}
      {!isLoading && !isError ? <ModuleCards modules={modules} onPrefetch={(moduleId) => void prefetchModuleDetail(queryClient, moduleId)} /> : null}
    </div>
  );
}

export function AdminModuleSchemaView({ moduleId }: { moduleId: string }) {
  const { data, isLoading, isError } = useModuleDetail(moduleId);
  const moduleDetail = data?.data;

  useRegisterBreadcrumbLabel(moduleId, moduleDetail?.name);

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader
        title={moduleDetail?.name ?? "Module Schema"}
        description="Dynamic capture fields used by log forms and AI extraction. Global schema changes are managed by Master."
        action={
          <Link href="/admin/modules" className={cn(buttonVariants({ variant: "outline" }), "rounded-xl")}>
            <AppIcon name="modules" className="size-4" />
            All Modules
          </Link>
        }
      />

      {isLoading ? <ModuleDetailSkeleton /> : null}
      {isError ? (
        <DashboardCard>
          <p className="p-5 text-sm text-muted-foreground">Could not load module schema.</p>
        </DashboardCard>
      ) : null}
      {moduleDetail ? <ModuleSchemaContent moduleDetail={moduleDetail} /> : null}
    </div>
  );
}

function ModulesToolbar({
  search,
  status,
  type,
  typeOptions,
  onSearchChange,
  onStatusChange,
  onTypeChange,
}: {
  search: string;
  status: string;
  type: string;
  typeOptions: Array<{ id: string; name: string }>;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onTypeChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <ResponsiveSearchControl
        placeholder="Search modules..."
        desktopClassName="lg:w-72"
        value={search}
        onChange={onSearchChange}
      />
      <Select value={type} onValueChange={(value) => value && onTypeChange(value)}>
        <SelectTrigger className="h-10 w-44 rounded-xl bg-secondary/70">
          <span className="truncate">{type === "all" ? "All Types" : label(typeOptions.find((option) => option.id === type)?.name ?? type)}</span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {typeOptions.map((item) => (
            <SelectItem key={item.id} value={item.id}>
              {label(item.name)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={status} onValueChange={(value) => value && onStatusChange(value)}>
        <SelectTrigger className="h-10 w-40 rounded-xl bg-secondary/70">
          <span className="truncate">{status === "all" ? "All Statuses" : label(status)}</span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {moduleStatuses.map((item) => (
            <SelectItem key={item} value={item}>
              {label(item)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function ModuleCards({ modules, onPrefetch }: { modules: ModuleListItem[]; onPrefetch: (moduleId: string) => void }) {
  if (!modules.length) {
    return (
      <DashboardCard>
        <p className="p-5 text-sm text-muted-foreground">No modules found.</p>
      </DashboardCard>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
      {modules.map((moduleItem) => (
        <DashboardCard key={moduleItem.id} className="rounded-xl">
          <div className="flex h-full flex-col gap-4 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className="flex size-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
                  style={{ backgroundColor: moduleItem.color || "#f7b51e" }}
                >
                  <AppIcon name={moduleIcon(moduleItem.icon)} className="size-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold text-card-foreground">
                    {moduleItem.name}
                  </h2>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {label(moduleItem.type)}
                  </p>
                </div>
              </div>
              <StatusBadge status={label(moduleItem.status)} />
            </div>

            <p className="line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
              {moduleItem.description ?? moduleItem.availabilityText}
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <MetaPill icon="database" label={`${moduleItem.fieldsCount} fields`} />
              <MetaPill icon="calendar" label={formatDate(moduleItem.createdAt)} />
            </div>

            <Link
              href={`/admin/modules/${moduleItem.id}`}
              className={cn(buttonVariants({ variant: "outline" }), "mt-auto rounded-xl")}
              onMouseEnter={() => onPrefetch(moduleItem.id)}
              onFocus={() => onPrefetch(moduleItem.id)}
            >
              <AppIcon name="database" className="size-4" />
              View Schema
            </Link>
          </div>
        </DashboardCard>
      ))}
    </div>
  );
}

function ModuleSchemaContent({ moduleDetail }: { moduleDetail: ModuleDetail }) {
  const fields = moduleDetail.fields ?? [];
  const requiredCount = fields.filter((field) => field.required).length;
  const aiCount = fields.filter((field) => field.aiExtract).length;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <DashboardStatCard label="Fields" value={String(fields.length)} helper="Total schema fields" icon="database" tone="blue" />
        <DashboardStatCard label="Required" value={String(requiredCount)} helper="Must be captured" icon="status" tone="amber" />
        <DashboardStatCard label="AI Extract" value={String(aiCount)} helper="Extracted from voice" icon="ai" tone="purple" />
        <DashboardStatCard label="Status" value={label(moduleDetail.status)} helper="Module availability" icon="modules" tone="green" />
      </div>

      <DashboardCard>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div
                className="flex size-12 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
                style={{ backgroundColor: moduleDetail.color || "#f7b51e" }}
              >
                <AppIcon name={moduleIcon(moduleDetail.icon)} className="size-6" />
              </div>
              <div className="min-w-0">
                <CardTitle>{moduleDetail.name}</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  {label(moduleDetail.type)} - {moduleDetail.category}
                </p>
              </div>
            </div>
            <StatusBadge status={label(moduleDetail.status)} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {moduleDetail.description ? (
            <p className="text-sm leading-6 text-muted-foreground">{moduleDetail.description}</p>
          ) : null}
        </CardContent>
      </DashboardCard>

      <DashboardCard>
        <CardHeader>
          <CardTitle>Capture Fields</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-2">
          <FieldsTable fields={fields} />
        </CardContent>
      </DashboardCard>
    </>
  );
}

function FieldsTable({ fields }: { fields: ModuleField[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Field</TableHead>
          <TableHead>Key</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Required</TableHead>
          <TableHead>AI Extract</TableHead>
          <TableHead>Order</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fields.length ? (
          fields.map((field) => (
            <TableRow key={field.id}>
              <TableCell className="font-medium text-foreground">{field.label}</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">{field.key}</TableCell>
              <TableCell>{field.type}</TableCell>
              <TableCell>{field.required ? "Yes" : "No"}</TableCell>
              <TableCell>{field.aiExtract ? "Yes" : "No"}</TableCell>
              <TableCell>{field.sortOrder}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
              No fields configured for this module.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

function MetaPill({ icon, label: text }: { icon: AppIconName; label: string }) {
  return (
    <div className="flex min-w-0 items-center gap-1.5 rounded-lg bg-secondary/70 px-2 py-1.5">
      <AppIcon name={icon} className="size-3.5 shrink-0" />
      <span className="truncate">{text}</span>
    </div>
  );
}

function ModuleDetailSkeleton() {
  return (
    <div className="space-y-4">
      <MasterCardGridSkeleton cards={4} />
      <DashboardCard>
        <div className="flex items-start justify-between gap-3 p-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="size-12 shrink-0 rounded-xl bg-secondary" />
            <div className="min-w-0 space-y-2">
              <div className="h-5 w-48 rounded bg-secondary" />
              <div className="h-4 w-36 rounded bg-secondary" />
            </div>
          </div>
          <div className="h-6 w-16 rounded-md bg-secondary" />
        </div>
      </DashboardCard>
      <DashboardCard>
        <MasterTableSkeleton columns={6} rows={5} />
      </DashboardCard>
    </div>
  );
}

function moduleIcon(icon: string | null | undefined): AppIconName {
  const iconMap: Record<string, AppIconName> = {
    "clipboard-text": "logs",
    "warning-circle": "warning",
    gauge: "status",
    "clock-countdown": "activity",
    sparkle: "ai",
    "git-branch": "modules",
  };

  return iconMap[String(icon)] ?? (icon as AppIconName) ?? "modules";
}

function label(value: string) {
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

