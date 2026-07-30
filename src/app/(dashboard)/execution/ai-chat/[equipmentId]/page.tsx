"use client";

import { useParams, useSearchParams } from "next/navigation";

import { ChatView } from "@/components/execution/ai-chat/chat-view";

export default function ExecutionAiChatEquipmentPage() {
  const params = useParams<{ equipmentId: string }>();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId") ?? undefined;

  return <ChatView equipmentId={params.equipmentId} sessionId={sessionId} />;
}
