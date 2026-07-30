import { ModuleDetailView } from "@/components/master/modules/module-detail-view";

type MasterModuleDetailPageProps = {
  params: Promise<{ moduleId: string }>;
};

export default async function MasterModuleDetailPage({
  params,
}: MasterModuleDetailPageProps) {
  const { moduleId } = await params;

  return <ModuleDetailView moduleId={moduleId} />;
}
