"use client";

import { DashboardPageHeader } from "@/components/common/dashboard-ui";
import { MasterFormSkeleton } from "@/components/master/master-skeletons";
import { useIssueCategoryDetail } from "@/features/admin-master-data/api/master-data.queries";
import { IssueCategoryForm } from "./issue-category-form";

export function EditIssueCategoryClient({ issueCategoryId }: { issueCategoryId: string }) {
  const { data, isLoading, isError } = useIssueCategoryDetail(issueCategoryId);
  const category = data?.data;
  return <div className="space-y-4 sm:space-y-6"><DashboardPageHeader title="Edit Issue Category" description="Update category name, module, default severity, and status." />{isLoading ? <MasterFormSkeleton /> : null}{isError ? <p className="text-sm text-muted-foreground">Could not load issue category.</p> : null}{category ? <IssueCategoryForm mode="edit" issueCategoryId={category.id} values={category} /> : null}</div>;
}
