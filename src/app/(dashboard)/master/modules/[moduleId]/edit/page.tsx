import { DashboardPageHeader } from "@/components/common/dashboard-ui";
import { ModuleForm } from "@/components/master/modules/module-form";

export default function EditGlobalModulePage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader
        title="Module Schema - Equipment Log"
        description="Module field schema and AI extraction preview"
      />

      <ModuleForm mode="edit" />
    </div>
  );
}
