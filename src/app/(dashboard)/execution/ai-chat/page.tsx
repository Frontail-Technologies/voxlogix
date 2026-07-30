"use client";

import Link from "next/link";

import { AppIcon } from "@/components/common/app-icon";
import { DashboardCard, DashboardPageHeader } from "@/components/common/dashboard-ui";
import { MasterCardGridSkeleton } from "@/components/master/master-skeletons";
import { buttonVariants } from "@/components/ui/button";
import { useChatSessions } from "@/features/ai-chat/api/chat.queries";
import type { ChatSessionSummary } from "@/features/ai-chat/api/chat.types";
import { cn } from "@/lib/utils";

function formatRelativeTime(value: string) {
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.round(diffMs / 60_000);

  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}

function equipmentLabel(session: ChatSessionSummary) {
  if (!session.equipmentId) return "Equipment not yet identified";
  return session.equipmentName ?? "Unknown equipment";
}

export default function ExecutionAiChatPage() {
  const { data, isLoading, isError } = useChatSessions();
  const sessions = data?.data ?? [];

  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardPageHeader
        title="Equipment AI"
        description="Ask about any equipment — start typing and I'll figure out which one you mean."
        action={
          <Link href="/execution/ai-chat/new" className={cn(buttonVariants(), "rounded-xl")}>
            <AppIcon name="plus" className="size-4" />
            New Chat
          </Link>
        }
      />

      {isLoading ? <MasterCardGridSkeleton /> : null}
      {isError ? (
        <DashboardCard>
          <p className="p-5 text-sm text-muted-foreground">Could not load previous chats.</p>
        </DashboardCard>
      ) : null}

      {!isLoading && !isError ? (
        sessions.length ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {sessions.map((session) => (
              <Link key={session.id} href={`/execution/ai-chat/${session.equipmentId ?? "new"}?sessionId=${session.id}`}>
                <DashboardCard className="h-full space-y-2 p-4 transition-colors hover:border-primary/50">
                  <div className="flex items-start gap-2">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary">
                      <AppIcon name="chat" className="size-4" />
                    </div>
                    <p className="min-w-0 truncate font-medium text-foreground">{session.title}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {equipmentLabel(session)} · {formatRelativeTime(session.updatedAt)}
                  </p>
                </DashboardCard>
              </Link>
            ))}
          </div>
        ) : (
          <DashboardCard>
            <p className="p-8 text-center text-sm text-muted-foreground">Start a new chat to ask about any equipment.</p>
          </DashboardCard>
        )
      ) : null}
    </div>
  );
}
