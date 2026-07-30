import { notFound } from "next/navigation";

import { MasterReportDetail } from "@/components/master/reports/master-reports";
import { isMasterReportType } from "@/components/master/reports/master-report-types";

type MasterReportPageProps = {
  params: Promise<{ reportType: string }>;
};

export default async function MasterReportPage({ params }: MasterReportPageProps) {
  const { reportType } = await params;

  if (!isMasterReportType(reportType)) {
    notFound();
  }

  return <MasterReportDetail type={reportType} />;
}
