import { EditModuleClient } from "@/components/master/modules/edit-module-client";

type EditGlobalModulePageProps = {
  params: Promise<{ moduleId: string }>;
};

export default async function EditGlobalModulePage({
  params,
}: EditGlobalModulePageProps) {
  const { moduleId } = await params;

  return <EditModuleClient moduleId={moduleId} />;
}
