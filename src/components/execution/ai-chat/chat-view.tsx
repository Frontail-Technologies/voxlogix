"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

import { AppIcon } from "@/components/common/app-icon";
import { DashboardPageHeader } from "@/components/common/dashboard-ui";
import { ResponsiveSearchControl } from "@/components/common/responsive-search-control";
import { MasterDetailSkeleton } from "@/components/master/master-skeletons";
import { useEquipmentDetail, useEquipmentList } from "@/features/admin-equipment/api/equipment.queries";
import type { EquipmentListItem } from "@/features/admin-equipment/api/equipment.types";
import { useChatSession } from "@/features/ai-chat/api/chat.queries";
import { useSendChatMessage } from "@/features/ai-chat/api/chat.mutations";
import type { ChatMessage, EquipmentSummary } from "@/features/ai-chat/api/chat.types";
import { showApiErrorToast } from "@/lib/api/error-toast";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  {
    title: "Maintenance Schedule",
    description: "Learn the recommended maintenance interval for this equipment.",
    prompt: "What is the recommended maintenance interval?",
  },
  {
    title: "Startup Checklist",
    description: "Walk through the daily startup checklist step by step.",
    prompt: "Walk me through the daily startup checklist.",
  },
  {
    title: "Warning Signs",
    description: "Understand what a warning light or alert means.",
    prompt: "What does this warning light mean?",
  },
  {
    title: "Safe Shutdown",
    description: "Get the safe shutdown steps before servicing.",
    prompt: "Steps to safely shut this down for service.",
  },
];

export function ChatView({ equipmentId, sessionId }: { equipmentId: string; sessionId?: string }) {
  const realEquipmentId = equipmentId === "new" ? undefined : equipmentId;

  const equipmentQuery = useEquipmentDetail(realEquipmentId ?? "");
  const sessionQuery = useChatSession(sessionId);
  const sendMessage = useSendChatMessage();
  const equipmentDetail = equipmentQuery.data?.data;
  const sessionDetail = sessionQuery.data?.data;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>(sessionId);
  const [hydratedSessionId, setHydratedSessionId] = useState<string | undefined>(undefined);
  const [resolvedEquipment, setResolvedEquipment] = useState<EquipmentSummary | null>(null);
  const [input, setInput] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  if (sessionDetail && sessionDetail.id !== hydratedSessionId) {
    setHydratedSessionId(sessionDetail.id);
    setMessages(sessionDetail.messages.map((message) => ({ id: message.id, role: message.role, content: message.content })));
  }

  if (equipmentDetail && !resolvedEquipment) {
    setResolvedEquipment({
      id: equipmentDetail.id,
      name: equipmentDetail.name,
      equipmentCode: equipmentDetail.equipmentCode,
    });
  }

  const equipmentSearchQuery = useEquipmentList({ search: searchQuery, limit: 8 });
  const searchResults = searchQuery.trim().length >= 2 ? (equipmentSearchQuery.data?.data ?? []) : [];

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, sendMessage.isPending]);

  function submitMessage(text: string, forcedEquipmentId?: string) {
    const trimmed = text.trim();
    if (!trimmed || sendMessage.isPending) return;

    const userMessage: ChatMessage = { id: `u-${Date.now()}`, role: "user", content: trimmed };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setShowSearch(false);

    sendMessage.mutate(
      { equipmentId: forcedEquipmentId ?? resolvedEquipment?.id, message: trimmed, sessionId: activeSessionId },
      {
        onSuccess: (response) => {
          if (!response.data) return;
          setActiveSessionId(response.data.sessionId);
          if (response.data.equipment) setResolvedEquipment(response.data.equipment);
          setMessages((current) => [
            ...current,
            {
              id: `a-${Date.now()}`,
              role: "assistant",
              content: response.data!.reply,
              suggestions: response.data!.suggestions,
            },
          ]);
        },
        onError: (error) => {
          showApiErrorToast(error, "The AI assistant could not respond");
        },
      },
    );
  }

  const hasMessages = messages.length > 0;
  const isLoading = Boolean(realEquipmentId) && equipmentQuery.isLoading;

  return (
    <div className="flex h-[calc(100vh-6.5rem)] flex-col gap-4 sm:gap-5">
      <DashboardPageHeader
        title={resolvedEquipment?.name ?? "New Chat"}
        description={resolvedEquipment ? resolvedEquipment.equipmentCode : "Ask a question and I'll figure out which equipment it's about."}
        hideDescriptionOnMobile={false}
      />

      {isLoading ? <MasterDetailSkeleton /> : null}

      {!isLoading ? (
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-border bg-card">
          <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto px-4 pb-32 pt-6 sm:px-8">
            {hasMessages ? (
              <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
                {messages.map((message) => (
                  <ChatBubble key={message.id} message={message} onSelectSuggestion={(item) => submitMessage(item.name, item.id)} />
                ))}
                {sendMessage.isPending ? <TypingBubble /> : null}
              </div>
            ) : (
              <EmptyState equipmentName={resolvedEquipment?.name} onSuggestionPress={submitMessage} />
            )}
            <div ref={scrollAnchorRef} />
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 bg-linear-to-t from-card via-card/95 to-transparent px-4 pb-4 pt-8 sm:px-8">
            {!resolvedEquipment ? (
              <div className="pointer-events-auto w-full max-w-3xl">
                <button
                  type="button"
                  onClick={() => setShowSearch((prev) => !prev)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  <AppIcon name="search" className="size-3.5" />
                  {showSearch ? "Hide search" : "Search equipment"}
                </button>

                {showSearch ? (
                  <div className="mt-2 space-y-2 rounded-2xl border border-border bg-background p-3 shadow-sm">
                    <ResponsiveSearchControl
                      placeholder="Search by name or ID"
                      desktopClassName="w-full"
                      value={searchQuery}
                      onChange={setSearchQuery}
                    />
                    <div className="max-h-40 space-y-1 overflow-y-auto">
                      {searchResults.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => submitMessage(item.name, item.id)}
                          className="flex w-full items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-left text-sm transition-colors hover:border-primary/50 hover:bg-primary/5"
                        >
                          <span className="truncate font-medium text-foreground">{item.name}</span>
                          <span className="shrink-0 text-xs text-muted-foreground">{item.equipmentCode}</span>
                        </button>
                      ))}
                      {searchResults.length === 0 ? (
                        <p className="px-1 py-2 text-xs text-muted-foreground">
                          {searchQuery.trim().length >= 2 ? "No equipment matched your search." : "Type at least 2 characters to search."}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="pointer-events-auto flex w-full max-w-3xl items-center gap-2 rounded-full border border-border bg-background px-2 py-2 shadow-sm">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground">
                <AppIcon name="voice" className="size-4" />
              </div>
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    submitMessage(input);
                  }
                }}
                placeholder={resolvedEquipment ? `Ask about ${resolvedEquipment.name}...` : "What do you need help with?"}
                className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                type="button"
                onClick={() => submitMessage(input)}
                disabled={!input.trim() || sendMessage.isPending}
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
              >
                <AppIcon name="caret-right" className="size-4 -rotate-90" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function EmptyState({
  equipmentName,
  onSuggestionPress,
}: {
  equipmentName?: string;
  onSuggestionPress: (suggestion: string) => void;
}) {
  return (
    <div className="mx-auto flex h-full w-full max-w-3xl flex-col items-center justify-center gap-8 py-8 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/12 text-primary">
          <AppIcon name="ai" className="size-7" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
            How can I <span className="text-primary">assist</span> you today?
          </h2>
          <p className="mx-auto max-w-md text-sm text-muted-foreground">
            {equipmentName
              ? `Ask me anything about the ${equipmentName} — troubleshooting, maintenance, or how it works.`
              : "Tell me what's going on and I'll figure out which equipment it's about."}
          </p>
        </div>
      </div>

      <div className="grid w-full gap-3 sm:grid-cols-2">
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion.title}
            type="button"
            onClick={() => onSuggestionPress(suggestion.prompt)}
            className="group relative flex flex-col items-start gap-1 rounded-2xl border border-border bg-background p-4 text-left transition-colors hover:border-primary/50 hover:bg-primary/5"
          >
            <AppIcon
              name="caret-right"
              className="absolute right-4 top-4 size-4 -rotate-45 text-muted-foreground transition-colors group-hover:text-primary"
            />
            <p className="pr-6 text-sm font-medium text-foreground">{suggestion.title}</p>
            <p className="text-xs text-muted-foreground">{suggestion.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function ChatBubble({
  message,
  onSelectSuggestion,
}: {
  message: ChatMessage;
  onSelectSuggestion: (equipment: EquipmentListItem) => void;
}) {
  const isUser = message.role === "user";

  return (
    <div className="flex flex-col gap-2">
      <div className={cn("flex items-end gap-2.5", isUser && "flex-row-reverse")}>
        {!isUser ? (
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
            <AppIcon name="ai" className="size-4" />
          </div>
        ) : null}
        <div
          className={cn(
            "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed sm:max-w-[70%]",
            isUser
              ? "rounded-tr-md bg-primary text-primary-foreground"
              : "rounded-tl-md bg-secondary/70 text-foreground",
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="chat-markdown">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>

      {!isUser && message.suggestions && message.suggestions.length > 0 ? (
        <div className="ml-10 flex flex-wrap gap-2">
          {message.suggestions.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectSuggestion(item)}
              className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-primary/5"
            >
              {item.name}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex items-end gap-2.5">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
        <AppIcon name="ai" className="size-4" />
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-md bg-secondary/70 px-4 py-3">
        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" />
      </div>
    </div>
  );
}
