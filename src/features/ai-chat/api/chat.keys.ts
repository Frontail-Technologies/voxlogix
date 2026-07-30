export const chatKeys = {
  all: ["ai-chat-sessions"] as const,
  list: () => [...chatKeys.all, "list"] as const,
  detail: (sessionId: string) => [...chatKeys.all, "detail", sessionId] as const,
};
