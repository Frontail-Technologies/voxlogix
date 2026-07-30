"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { AppIcon } from "@/components/common/app-icon";
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
import { DeleteConfirmDialog } from "@/components/common/delete-confirm-dialog";
import { ResponsiveSearchControl } from "@/components/common/responsive-search-control";
import { TablePagination } from "@/components/common/table-pagination";
import { MasterTableSkeleton } from "@/components/master/master-skeletons";
import { buttonVariants } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { useDeleteEquipmentCategory } from "@/features/admin-master-data/api/master-data.mutations";
import { useEquipmentCategoriesList } from "@/features/admin-master-data/api/master-data.queries";
import type { EquipmentCategoryItem } from "@/features/admin-master-data/api/master-data.types";
import { formatMasterDataDate, masterDataLabel, masterDataStatuses } from "@/features/admin-master-data/master-data.presentation";
import { showApiErrorToast } from "@/lib/api/error-toast";
import { cn } from "@/lib/utils";

type PaginationMeta = {
  page: number;
  totalPages: number;
  offset: number;
  limit: number;
  totalItems: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export function EquipmentCategoriesList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "all";
  const { data, isLoading, isError } = useEquipmentCategoriesList({
    page,
    limit: 20,
    search,
    status: status === "all" ? undefined : status,
  });
  const categories = data?.data ?? [];
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
        title="Equipment Categories"
        description="Manage equipment category labels used when creating or editing equipment."
        action={<Link href="/admin/equipment-categories/new" className={cn(buttonVariants(), "rounded-xl")}><AppIcon name="plus" className="size-4" />Add Category</Link>}
      />
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <ResponsiveSearchControl placeholder="Search categories..." desktopClassName="sm:w-80" value={search} onChange={(value) => updateQuery("search", value)} />
          <Select value={status} onValueChange={(value) => value && updateQuery("status", value)}>
            <SelectTrigger className="h-10 w-44 rounded-xl bg-secondary/70">
              <span className="truncate">{status === "all" ? "All Statuses" : masterDataLabel(status)}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {masterDataStatuses.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        {meta ? <MasterDataPagination meta={meta} page={page} onPageChange={(nextPage) => updateQuery("page", String(nextPage))} /> : null}
        <DashboardCard>
          {isLoading ? <MasterTableSkeleton columns={4} /> : null}
          {isError ? <p className="p-5 text-sm text-muted-foreground">Could not load equipment categories.</p> : null}
          {!isLoading && !isError ? <EquipmentCategoriesTable categories={categories} /> : null}
        </DashboardCard>
      </div>
    </div>
  );
}

function MasterDataPagination({
  meta,
  page,
  onPageChange,
}: {
  meta: PaginationMeta;
  page: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <TablePagination
      page={meta.page}
      totalPages={meta.totalPages}
      startItem={meta.totalItems ? meta.offset + 1 : 0}
      endItem={Math.min(meta.offset + meta.limit, meta.totalItems)}
      totalItems={meta.totalItems}
      canPrevious={meta.hasPreviousPage}
      canNext={meta.hasNextPage}
      onPageChange={onPageChange}
      onPrevious={() => onPageChange(Math.max(1, page - 1))}
      onNext={() => onPageChange(page + 1)}
    />
  );
}

function EquipmentCategoriesTable({ categories }: { categories: EquipmentCategoryItem[] }) {
  return (
    <Table className="[&_td]:py-3">
      <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Status</TableHead><TableHead>Updated</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
      <TableBody>
        {categories.length ? categories.map((category) => <EquipmentCategoryRow key={category.id} category={category} />) : <TableRow><TableCell colSpan={4} className="py-8 text-center text-muted-foreground">No equipment categories found.</TableCell></TableRow>}
      </TableBody>
    </Table>
  );
}

function EquipmentCategoryRow({ category }: { category: EquipmentCategoryItem }) {
  const deleteMutation = useDeleteEquipmentCategory();
  const [dialogOpen, setDialogOpen] = useState(false);
  async function handleDelete() {
    try {
      await deleteMutation.mutateAsync(category.id);
      toast.success("Equipment category deleted");
    } catch (error) {
      showApiErrorToast(error, "Could not delete equipment category");
    }
  }
  return <TableRow><TableCell className="font-medium text-foreground">{category.name}</TableCell><TableCell><StatusBadge status={masterDataLabel(category.status)} /></TableCell><TableCell className="text-muted-foreground">{formatMasterDataDate(category.updatedAt)}</TableCell><TableCell className="text-right"><div className="inline-flex items-center gap-1"><Link href={`/admin/equipment-categories/${category.id}/edit`} className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"><AppIcon name="settings" className="size-4" /><span className="sr-only">Edit</span></Link><button type="button" className="inline-flex size-8 items-center justify-center rounded-md text-destructive hover:bg-destructive/10" onClick={() => setDialogOpen(true)}><AppIcon name="trash" className="size-4" /><span className="sr-only">Delete</span></button></div><DeleteConfirmDialog open={dialogOpen} onOpenChange={setDialogOpen} title="Delete equipment category?" description={`This will delete ${category.name}.`} confirmLabel="Delete Category" onConfirm={() => void handleDelete()} /></TableCell></TableRow>;
}
