"use client";

import { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";

import { ChatView } from "@/components/execution/ai-chat/chat-view";
import { MasterDetailSkeleton } from "@/components/master/master-skeletons";

function ExecutionAiChatEquipmentPageContent() {
  const params = useParams<{ equipmentId: string }>();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId") ?? undefined;

  return <ChatView equipmentId={params.equipmentId} sessionId={sessionId} />;
}

export default function ExecutionAiChatEquipmentPage() {
  return (
    <Suspense fallback={<MasterDetailSkeleton />}>
      <ExecutionAiChatEquipmentPageContent />
    </Suspense>
  );
}
