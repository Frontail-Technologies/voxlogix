"use client";

import { DashboardPageHeader } from "@/components/common/dashboard-ui";
import { useRegisterBreadcrumbLabel } from "@/components/common/page-header-navigation";
import { MasterFormSkeleton } from "@/components/master/master-skeletons";
import { ModuleForm } from "@/components/master/modules/module-form";
import { useModuleDetail } from "@/features/master-modules/api/module.queries";

export function EditModuleClient({ moduleId }: { moduleId: string }) {
  const { data, isLoading, isError } = useModuleDetail(moduleId);
  const moduleDetail = data?.data;

  useRegisterBreadcrumbLabel(moduleId, moduleDetail?.name);

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader title={moduleDetail ? `Module Schema - ${moduleDetail.name}` : "Module Schema"} description="Module field schema and AI extraction preview" />
      {isLoading ? <MasterFormSkeleton /> : null}
      {isError ? <p className="text-sm text-muted-foreground">Could not load module.</p> : null}
      {moduleDetail ? <ModuleForm key={moduleDetail.id} mode="edit" moduleId={moduleDetail.id} values={moduleDetail} /> : null}
    </div>
  );
}
