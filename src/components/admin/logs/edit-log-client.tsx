"use client";

import { DashboardPageHeader } from "@/components/common/dashboard-ui";
import { useRegisterBreadcrumbLabel } from "@/components/common/page-header-navigation";
import { LogForm } from "@/components/admin/logs/log-form";
import { MasterFormSkeleton } from "@/components/master/master-skeletons";
import { useLogDetail } from "@/features/logs/api/log.queries";
import { useModuleDetail, useModulesList } from "@/features/master-modules/api/module.queries";

export function EditLogClient({ logId }: { logId: string }) {
  const { data, isLoading, isError } = useLogDetail(logId);
  const log = data?.data;
  const modulesQuery = useModulesList({ limit: 100, status: "ACTIVE" });
  const fallbackModule = modulesQuery.data?.data?.find((module) => {
    const moduleType = log?.moduleType?.toLowerCase();
    return (
      moduleType &&
      (module.type.toLowerCase() === moduleType ||
        module.name.toLowerCase() === moduleType ||
        module.slug.toLowerCase() === moduleType.toLowerCase())
    );
  });
  const moduleId = log?.module?.id ?? fallbackModule?.id ?? "";
  const moduleQuery = useModuleDetail(moduleId);

  useRegisterBreadcrumbLabel(logId, log?.logNumber ?? log?.title);

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader
        title="Edit Log"
        description="Edit the module schema fields captured for this log."
      />
      {isLoading ? <MasterFormSkeleton /> : null}
      {isError ? (
        <p className="text-sm text-muted-foreground">Could not load log.</p>
      ) : null}
      {log ? (
        <LogForm
          mode="edit"
          logId={log.id}
          moduleFields={moduleQuery.data?.data?.fields ?? []}
          schemaLoading={moduleQuery.isLoading || modulesQuery.isLoading}
          values={{
            moduleId,
            equipmentId: log.equipment?.id,
            equipmentName: log.equipment?.name,
            equipmentCode: log.equipment?.equipmentCode,
            moduleType: log.moduleType,
            title: log.title,
            description: log.description,
            transcript: log.transcript,
            issueCategory: log.issueCategory,
            downtimeMinutes: log.downtimeMinutes,
            voiceDurationSeconds: log.voiceDurationSeconds,
            voiceRecordingUrl: log.voiceRecordingUrl,
            capturedAddress: log.capturedAddress,
            capturedLatitude: log.capturedLatitude,
            capturedLongitude: log.capturedLongitude,
            severity: log.severity,
            status: log.status,
            extractedFields: log.extractedFields,
          }}
        />
      ) : null}
    </div>
  );
}
