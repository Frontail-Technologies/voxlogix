import { DashboardPageHeader } from "@/components/common/dashboard-ui";
import { ModuleForm } from "@/components/master/modules/module-form";

export default function NewGlobalModulePage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader
        title="Add Global Module"
        description="Create a mock platform module definition"
      />

      <ModuleForm mode="create" />
    </div>
  );
}
